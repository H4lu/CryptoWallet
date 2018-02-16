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
if return 0 - ok
if return 1 - Invalid PIN
if return 2 - Device is not connected
if returm 3 - Åhe signature is not correct
(IN) BYTE *messageHex - the 64 char message hash being signed
(IN) int numberAdres - we have two address 1 or 2
(IN) char * szUserPin - pin code / default "12345678"
(OUT) BYTE *dataForTransactionHex - data for the transaction HEX  !!![min220]!!!
(OUT) int &dataForTransactionHexLength - length data for the transaction HEX (usually 212-214 byte)
*/
extern "C" __declspec(dllexport) int get_dataForTransaction(BYTE * messageHex, int numberAdres, char * UserPin,
															BYTE * dataForTransactionHex, int *dataForTransactionHexLength);




/*
-- return 0 - OK, return 1 - Invalid PIN, 2 - Device is not connected, 3 - size of arrayMnemonicPhrase less than the number of mnemonic words
-- generate entropy, private and public key, write them into device and encoding as mnemonic words(word's numbers from dictionary)
(IN) int lenEntropy - 128 (12 words), 160 (15 words), 192 (18 words), 224 (21 words), 256 (24 words)
(OUT) int *arrayMnemonicPhrase - array of numbers consisting of word numbers in the dictionary
(IN) int lenArrayMnemonicPhrase - length array of numbers consisting of word numbers in the dictionary
(IN) char * szUserPin - pin code / default "12345678"
*/
extern "C" __declspec(dllexport) int genPrivKeyAndMnem(int lenEntropy, int *arrayMnemonicPhrase, int lenArrayMnemonicPhrase, BYTE *password, int lenPassword, char * UserPin);



/*
-- return 0 - OK, return 1 - size of arrayMnemonicPhrase less than the number of mnemonic words, 2 - fail encode entropy
-- -- get mnemonic words(word's numbers from dictionsry) and encoding as entropy, private and public key, write them into device
(IN) int lenEntropy - 128 (12 words), 160 (15 words), 192 (18 words), 224 (21 words), 256 (24 words)
(OUT) int *arrayMnemonicPhrase - array of numbers consisting of word numbers in the dictionary
(IN) int lenArrayMnemonicPhrase - length array of numbers consisting of word numbers in the dictionary
(IN) char * szUserPin - pin code / default "12345678"
*/
extern "C" __declspec(dllexport) int genPrivKeyFromMnem(bool compr, int lenEntropy, int *arrayMnemonicPhrase, int lenArrayMnemonicPhrase, char * UserPin, BYTE *passwordOld, int lenPasswordOld, BYTE *password, int lenPassword);


/*
(IN) int numberAdres - we have two address 1 or 2
(OUT) BYTE *addressEthereum - Pubkey hash address HEX-format 40 bytes
(OUT) BYTE * pubKeyEthereum) - public key HEX-format 128 bytes
*/
extern "C" __declspec(dllexport) int get_addressEthereum(int numberAdres, BYTE *addressEthereum, BYTE * pubKeyEthereum);



/*
(IN) BYTE *messageHex - the message you want to sign 64 bytes
(IN) int numberAdres - we have two address 1 or 2
(IN) char * szUserPin - pin code / default "12345678"
(OUT) BYTE * signatureBin1 - signature 64 bytes (r - 32, s - 32)
(OUT) BYTE * signatureBin2 - signature 64 bytes (r - 32, s - 32)
(OUT) int * v - 27 or 28
*/
extern "C" __declspec(dllexport) int getSignEthereum(BYTE * messageHex, int numberAddress, char * UserPin, BYTE * signatureBin, int *v);


/*
--(OUT_get_addres) unsigned int &error = code error, if error = 0 - ok / error != 0 - ERROR
(IN) int numberAdres - we have two address 1 or 2
(IN) bool net  - true: Pubkey hash (P2PKH address) / false: Testnet pubkey hash
(OUT) BYTE *outBase58checkAddress - Pubkey hash (P2PKH address) Base58chek HEXformat
(OUT) int &lengthOutBase58checkAddress - length addres
*/
extern "C" __declspec(dllexport) int get_addressLitecoin(int numberAdres, bool net, BYTE *outBase58checkAddress, int &lengthOutBase58checkAddress);
