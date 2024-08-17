import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { Program } from "@coral-xyz/anchor";
import { program, counterPDA } from "../anchor/setup";
// import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";

export default function IncrementButton() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!publicKey) {
      console.error("No wallet connected.");
      return;
    }

    setIsLoading(true);

    try {
      // Log counterPDA before creating the transaction
      console.log("Counter PDA:", counterPDA.toBase58());

      // Ensure the PDA account exists
      const accountInfo = await connection.getAccountInfo(counterPDA);
      if (!accountInfo) {
        throw new Error("Counter PDA account does not exist");
      }
      console.log("Counter PDA Account Info:", accountInfo);

      // Create the transaction
      const transaction = await program.methods
        .increment()
        .accounts({
          counter: counterPDA,
        })
        .transaction();

      // Ensure the transaction has the required fields
      const recentBlockhash = await connection.getRecentBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
      transaction.feePayer = publicKey;

      // Log transaction details
      console.log("Transaction before signing:", transaction);

      // Sign the transaction with the wallet
      const signedTransaction = await sendTransaction(transaction, connection);

      console.log("Signed Transaction:", signedTransaction);

      // Send the transaction
      const transactionSignature = await signedTransaction;

      console.log(`Transaction successful! Signature: ${transactionSignature}`);
      console.log(`View on explorer: https://solana.fm/tx/${transactionSignature}?cluster=devnet-alpha`);

    } catch (error) {
      console.error("Transaction failed:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button className="w-24" onClick={onClick} disabled={!publicKey}>
      {isLoading ? "Loading" : "Increment"}
    </button>
  );
}
