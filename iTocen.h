#pragma once
typedef unsigned char BYTE;
#ifdef WIN32
typedef unsigned long		ULONG;
#else
typedef unsigned int		ULONG;
#endif



/*
--(OUT_get_addres) unsigned int &error = code error, if error = 0 - ok / error != 0 - ERROR
(IN) int numberAdres - we have two address 1 or 2
(IN) bool net  - true: Pubkey hash (P2PKH address) / false: Testnet pubkey hash
(OUT) BYTE *outBase58checkAddress - Pubkey hash (P2PKH address) Base58chek HEXformat
(OUT) int &lengthOutBase58checkAddress - length addres
*/
extern "C" __declspec(dllexport) int get_address(int numberAdres, bool net, BYTE *outBase58checkAddress, int &lengthOutBase58checkAddress);



 /*
 --OUT_get_signature - create an ECDSA signature
 (IN) BYTE * messageHex - the 64-byte HEX message hash being signed
 (IN) int numberAdres - we have two address 1 or 2
 (IN) char * szUserPin - pin code / default "12345678"
 (OUT) BYTE * signatureHex - array[200] where the signature will be placed HEXformat
 (OUT) BYTE * signatureBin - array[100] where the signature will be placed BINformat
 (OUT) unsigned int signatureHexLength - length signed hash HEX
 (OUT) unsigned int signatureBinLength - length signed hash BIN
 (OUT) BYTE *compressedPubKeyBin - compressed public key BIN  !!![min33]!!!
 (OUT) int &compressedPubKeyLengthBin - length compressed public key BIN
 (OUT) BYTE *compressedPubKeyHEX - compressed public key HEX  !!![min66]!!!
 (OUT) int &compressedPubKeyLengthHEX - length compressed public key HEX
 */
extern "C" __declspec(dllexport) int get_signature(BYTE * messageHex, int numberAdres, char * szUserPin,
	BYTE * signatureHex, BYTE * signatureBin, int &signatureHexLength, int &signatureBinLength,
	BYTE *compressedPubKeyBin, int &compressedPubKeyLengthBin, BYTE *compressedPubKeyHex, int &compressedPubKeyLengthHex);


/*
--OUT_get_dataForTransaction - create an ECDSA signature, compressed public key and connects them to retrieve data for the transaction
(IN) BYTE * messageHex - the 64 - byte HEX message hash being signed
(IN) int numberAdres - we have two address 1 or 2
(IN) char * szUserPin - pin code / default "12345678"
(OUT) BYTE *dataForTransactionHex - data for the transaction HEX  !!![min220]!!!
(OUT) BYTE *dataForTransactionBin - data for the transaction BIN  !!![min110]!!!
(OUT) int &dataForTransactionHexLength - length data for the transaction HEX (usually 212-214 byte)
(OUT) int &dataForTransactionBinLength - length data for the transaction BIN (usually 106-107 byte)
*/
extern "C" __declspec(dllexport) int get_dataForTransaction(BYTE * messageHex, int numberAdres, char * UserPin,
	BYTE * dataForTransactionHex, BYTE * dataForTransactionBin, int *dataForTransactionHexLength, int *dataForTransactionBinLength);