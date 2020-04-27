#define LED_RED1 9 //светодиод для температуры
#define LED_GREEN1 3 //светодиод для температуры
//#define LED_RED2 5 //светодиод управляется через кнопку
#define LED_GREEN2 6 //светодиод управляется через кнопку
#define PIN_PHOTO_SENSOR A1 //если поменяется выход, нужно тут поправить

int sensorPin = 0; //А0
int signalVoltage, celsiusTemp; //напряжение, температура

#include <Servo.h> //используем библиотеку для работы с сервоприводом
#include <Thread.h>  // подключение библиотеки ArduinoThread
Servo servo; //объявляем переменную servo типа Servo
Thread inputThread = Thread(); //объявляем потоки
Thread outputThread = Thread(); 

void setup() {

Serial.begin(112500);
pinMode(LED_RED1, OUTPUT);
pinMode(LED_GREEN1, OUTPUT);
//pinMode(LED_RED2, OUTPUT);
pinMode(LED_GREEN2, OUTPUT);

servo.attach(11);

inputThread.onRun(pressButton);  // назначаем потоку задачу
inputThread.setInterval(503); // задаём интервал срабатывания, мсек

outputThread.onRun(sendParametrs); 
outputThread.setInterval(997); 
}

void loop() {

  if (outputThread.shouldRun())
        outputThread.run(); // запускаем поток
        
  if (inputThread.shouldRun())
        inputThread.run();
}

void pressButton() {
  
   if (Serial.available() > 0) 
   {
    int valueGreen = Serial.read() - '0';//read from the serial connection; the - '0' is to cast the values as the int and not the ASCII code
      if(valueGreen==1){ //если 1 - то включаем
        analogWrite(LED_GREEN2, HIGH);
        servo.write(180);
      }
      if(valueGreen==0){ //если 0 - то выключаем
        analogWrite(LED_GREEN2, LOW);
        servo.write(0);
      }
   }
}

void sendParametrs() {
  
  signalVoltage = analogRead(sensorPin); //получаем значения напряжения с датчика температуры
  double voltage = (signalVoltage * 1.1) / 1024.0; 
  double celsiusTemp = (voltage - 0.5) * 100 ;  

  if(celsiusTemp > 31) { // больше 31 - включаем красный, меньше - зеленый
    digitalWrite(LED_GREEN1, LOW);
    digitalWrite(LED_RED1, HIGH);
  } else {
    digitalWrite(LED_GREEN1, HIGH);
    digitalWrite(LED_RED1, LOW);
  }

  int val = analogRead(PIN_PHOTO_SENSOR); //читаем с фоторезистора, код закомменчен, т.к. сломался фоторезистор
  /*if (val > 690) { 
    servo.write(0); //ставим вал под 0, если темнеет
  } else {
    servo.write(180); //ставим вал под 180, если светлеет
  }*/
  Serial.print(celsiusTemp);
  Serial.print(' ');
  Serial.print(val);
  Serial.print(' ');
  Serial.println(servo.read());
}
