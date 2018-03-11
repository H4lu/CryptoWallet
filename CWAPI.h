#pragma once
typedef unsigned char BYTE;
#ifdef WIN32
typedef unsigned long		ULONG;
#else
typedef unsigned int		ULONG;
#endif


//Информация о криптокошельке
/*
--(OUT_get_cwInfo):
-0 - кошелек обнаружен, симка обнаружена, пин подтвержден
-1 - кошелек не обнаружен
-2 - кошелек обнаружен, симки нет
-3 - кошелек обнаружен, симка обнаружена, ожидается проверка пин
-4 - кошелек обнаружен, симка обнаружена, пин не задан
-5 - кошелек обнаружен, симка обнаружена, симка блокирована (число проверок пин исчерпано)
*/
extern "C" __declspec(dllexport) int get_currencyWalletInfo(); //возвращаемое значение в этой функции актуально для всех остальных функций.

															   //Получить число доступных валют
extern "C" __declspec(dllexport) int get_numberOfCurrencies(int *num); //num[0] - число доступных валют

																	   //Получить информацию о кошельке для конкретной валюты
extern "C" __declspec(dllexport) int get_CurrencyInfo(int idCurrency, int* lenInfo, BYTE *outInfo);


//idCurrency - номер валюты (индексация с нуля)
// - 0 - bitcoin
// - 1 - ethereum
// - 2 - litecoin
//lenInfo[0] - реальный размер данных в outInfo, 

//outInfo - outInfo[0..y], outInfo[y] - максимально возможный вариант для всех валют (сейчас 50),
//outInfo[0..x]- краткое название валюты (char ASCII) outInfo[x] = '\0'
//outInfo[x+1..x+lenInfo[0]] - адрес кошелька (hex base58)

//Получить подпись транзакции
extern "C" __declspec(dllexport) int getSign(int messageLen, BYTE * message, int idCurrency, int* lenSign, BYTE *signature);
//messageLen - длина подписываемых данных
//message - данные для подписи
//idCurrency - номер валюты (индексация с нуля)
//lenSign[0] - реальный размер данных в signature

//signature - signature[0..y], signature[y] - максимально возможный вариант для всех валют (сейчас 282),
//signature[0..lenSign[0]] - подпись