#pragma once
typedef unsigned char BYTE;
#ifdef WIN32
typedef unsigned long		ULONG;
#else
typedef unsigned int		ULONG;
#endif


//���������� � ��������������
/*
--(OUT_get_cwInfo):
-0 - ������� ���������, ����� ����������, ��� �����������
-1 - ������� �� ���������
-2 - ������� ���������, ����� ���
-3 - ������� ���������, ����� ����������, ��������� �������� ���
-4 - ������� ���������, ����� ����������, ��� �� �����
-5 - ������� ���������, ����� ����������, ����� ����������� (����� �������� ��� ���������)
*/
extern "C" __declspec(dllexport) int get_currencyWalletInfo(); //������������ �������� � ���� ������� ��������� ��� ���� ��������� �������.

															   //�������� ����� ��������� �����
extern "C" __declspec(dllexport) int get_numberOfCurrencies(int *num); //num[0] - ����� ��������� �����

																	   //�������� ���������� � �������� ��� ���������� ������
extern "C" __declspec(dllexport) int get_CurrencyInfo(int idCurrency, int* lenInfo, BYTE *outInfo);


//idCurrency - ����� ������ (���������� � ����)
// - 0 - bitcoin
// - 1 - ethereum
// - 2 - litecoin
//lenInfo[0] - �������� ������ ������ � outInfo, 

//outInfo - outInfo[0..y], outInfo[y] - ����������� ��������� ������� ��� ���� ����� (������ 50),
//outInfo[0..x]- ������� �������� ������ (char ASCII) outInfo[x] = '\0'
//outInfo[x+1..x+lenInfo[0]] - ����� �������� (hex base58)

//�������� ������� ����������
extern "C" __declspec(dllexport) int getSign(int messageLen, BYTE * message, int idCurrency, int* lenSign, BYTE *signature);
//messageLen - ����� ������������� ������
//message - ������ ��� �������
//idCurrency - ����� ������ (���������� � ����)
//lenSign[0] - �������� ������ ������ � signature

//signature - signature[0..y], signature[y] - ����������� ��������� ������� ��� ���� ����� (������ 282),
//signature[0..lenSign[0]] - �������