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
--OUT_get_dataForTransaction - create an ECDSA signature, compressed public key and connects them to retrieve data for the transaction
(IN) int messageInt - the 65 int message hash being signed messageInt[0-63] - message, messageInt[64] - 999 (end massive)
(IN) int numberAdres - we have two address 1 or 2
(IN) char * szUserPin - pin code / default "12345678"
(OUT) BYTE *dataForTransactionHex - data for the transaction HEX  !!![min220]!!!
(OUT) BYTE *dataForTransactionBin - data for the transaction BIN  !!![min110]!!!
(OUT) int &dataForTransactionHexLength - length data for the transaction HEX (usually 212-214 byte)
(OUT) int &dataForTransactionBinLength - length data for the transaction BIN (usually 106-107 byte)
*/
extern "C" __declspec(dllexport) int get_dataForTransaction(BYTE * messageHex, int numberAdres, char * UserPin,
															BYTE * dataForTransactionHex, int *dataForTransactionHexLength);