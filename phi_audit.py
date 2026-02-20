"""
phi_audit.py
Φ Audit Layer — Signed Hash Chain (Level B)

Implements:
- Linear hash chain
- Ed25519 signature of chain state
- No semantic storage
- No feedback into Φ

Compatible with:
PHI_LOG_PROTOCOL.md
"""

import json
import os
import hashlib
import time
from nacl.signing import SigningKey, VerifyKey
from nacl.encoding import HexEncoder


class PhiAudit:

    def __init__(self, log_path="phi_log.jsonl",
                 audit_path="phi_audit.json",
                 private_key_path="phi_private.key",
                 public_key_path="phi_public.key"):

        self.log_path = log_path
        self.audit_path = audit_path
        self.private_key_path = private_key_path
        self.public_key_path = public_key_path

        self._ensure_keys()
        self.previous_chain_hash = self._load_last_chain_hash()

    # ---------------------------------------------------
    # Key Management
    # ---------------------------------------------------

    def _ensure_keys(self):
        if not os.path.exists(self.private_key_path):
            signing_key = SigningKey.generate()
            verify_key = signing_key.verify_key

            with open(self.private_key_path, "wb") as f:
                f.write(signing_key.encode())

            with open(self.public_key_path, "wb") as f:
                f.write(verify_key.encode())

            print("[Φ-AUDIT] New Ed25519 keypair generated.")

    def _load_signing_key(self):
        with open(self.private_key_path, "rb") as f:
            return SigningKey(f.read())

    def _load_verify_key(self):
        with open(self.public_key_path, "rb") as f:
            return VerifyKey(f.read())

    # ---------------------------------------------------
    # Hashing
    # ---------------------------------------------------

    def _hash(self, data: str) -> str:
        return hashlib.sha256(data.encode()).hexdigest()

    def _load_last_chain_hash(self):
        if not os.path.exists(self.audit_path):
            return "0" * 64

        with open(self.audit_path, "r") as f:
            audit_data = json.load(f)
            return audit_data.get("last_chain_hash", "0" * 64)

    # ---------------------------------------------------
    # Logging Entry
    # ---------------------------------------------------

    def append_entry(self, entry: dict):
        """
        entry must already conform to PHI_LOG_PROTOCOL
        """

        entry_json = json.dumps(entry, sort_keys=True)
        entry_hash = self._hash(entry_json)

        chain_hash = self._hash(self.previous_chain_hash + entry_hash)

        signed_chain_hash = self._sign(chain_hash)

        audit_record = {
            "timestamp": int(time.time()),
            "entry_hash": entry_hash,
            "chain_hash": chain_hash,
            "signature": signed_chain_hash
        }

        # append to log file
        with open(self.log_path, "a") as f:
            f.write(entry_json + "\n")

        # update audit file
        with open(self.audit_path, "w") as f:
            json.dump({
                "last_chain_hash": chain_hash,
                "last_signature": signed_chain_hash
            }, f, indent=2)

        self.previous_chain_hash = chain_hash

        return audit_record

    # ---------------------------------------------------
    # Signing
    # ---------------------------------------------------

    def _sign(self, message: str) -> str:
        signing_key = self._load_signing_key()
        signed = signing_key.sign(message.encode())
        return signed.signature.hex()

    # ---------------------------------------------------
    # Verification
    # ---------------------------------------------------

    def verify_chain_hash(self, chain_hash: str, signature_hex: str) -> bool:
        try:
            verify_key = self._load_verify_key()
            verify_key.verify(chain_hash.encode(), bytes.fromhex(signature_hex))
            return True
        except Exception:
            return False

    # ---------------------------------------------------
    # Full Log Integrity Check
    # ---------------------------------------------------

    def verify_full_log(self) -> bool:
        if not os.path.exists(self.log_path):
            return True

        verify_key = self._load_verify_key()

        previous_hash = "0" * 64

        with open(self.log_path, "r") as f:
            for line in f:
                entry = json.loads(line.strip())
                entry_json = json.dumps(entry, sort_keys=True)
                entry_hash = self._hash(entry_json)
                chain_hash = self._hash(previous_hash + entry_hash)
                previous_hash = chain_hash

        if not os.path.exists(self.audit_path):
            return False

        with open(self.audit_path, "r") as f:
            audit_data = json.load(f)

        final_chain_hash = audit_data["last_chain_hash"]
        final_signature = audit_data["last_signature"]

        try:
            verify_key.verify(final_chain_hash.encode(), bytes.fromhex(final_signature))
            return final_chain_hash == previous_hash
        except Exception:
            return False
