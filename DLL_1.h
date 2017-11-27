#pragma once
/*
в сет передаешь 16 символов, из пуе их читаешь
*/
extern "C" __declspec(dllexport) void set_get(unsigned char * set, unsigned char * get);


/*
из гет должен прочитать 16 символов "0123456789ABCDEF"
*/
extern "C" __declspec(dllexport) void get(unsigned char * get);