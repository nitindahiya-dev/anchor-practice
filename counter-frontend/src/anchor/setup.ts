import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL } from "./idl";
import * as buffer from "buffer";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey("B2Sj5CsvGJvYEVUgF1ZBnWsBzWuHRQLrgMSJDjBU5hWA");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
window.Buffer = buffer.Buffer;
export const program = new Program(IDL, programId, {
  connection,
});

export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  program.programId
);

export type CounterData = IdlAccounts<typeof IDL>["counter"];
