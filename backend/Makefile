.PHONY: help mindif fibonacci mqtt clean 

help:
	@echo "Usage:\n\
 make mindif <_esting/input10.json\n\
  Compile( if necessary )and run the MinDif class\n\
  redirecting the input file.\n\
 make fibonacci\n\
  One does not simply makes Fibonacci..\n\
 make mqtt\n\
  That\"s some messaging\n\
 make clean\n\
  rm -f all bin/ content"

mindif: bin/MinDif.class
	@java -cp ".:./jar/jackson/*:./bin" MinDif

bin/MinDif.class: MinDif.java
	javac -Xlint -cp ".:./jar/jackson/*" -d "./bin" $<

fibonacci: bin/Fibonacci.class
	@java -cp ".:./bin" Fibonacci

bin/Fibonacci.class: Fibonacci.java
	javac -Xlint -d "./bin" $<

mqtt: bin/Mqtt.class
	@java -cp ".:./jar/jackson/*:./jar/mqtt/*:./bin" Mqtt

bin/Mqtt.class: Mqtt.java
	javac -Xlint -cp ".:./jar/jackson/*:./jar/mqtt/*" -d "./bin" $<

clean:
	@rm -fv ./bin/*.class
