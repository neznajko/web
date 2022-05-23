# Service locator
The files are in the ``io/pliant/internship2022/service/locator/`` directory. To compile and run the project type:
```sh
javac io/pliant/internship2022/service/locator/*.java
java io.pliant.internship2022.service.locator.ServiceLocatorImpl
```
# Minimum differences
The code is in the ``MinDif.java`` file. It uses the *Jackson* library,
which can be found in the **jar/jackson/** sub-directory. To compile and
run the program type for example ``make mindif <_esting/input5.json``, which basically do the following:
```sh
javac -Xlint -cp ".:./jar/jackson/*" -d "./bin" MinDif.java
java -cp ".:./jar/jackson/*:./bin" MinDif <_esting/input5.json
```
The programs are written in Linux, I'm not sure if Windows supports
redirection, if not remove the redirection and dump the input on the
command line. I couldn't found anything better than the brute force 
*O(N<sup>2</sup>)* solution. One benefit of this approach is that it guarantees a correct algorithm, which is confirmed by the results of the *test.sh* script at ***test.log***.
# Mqtt
The program is in *Mqtt.java* file, it uses the ***eclipce/paho*** library
which can be found at *jar/mqtt/* directory. It subscribes to everything from **pliant.io**, and if the topic is *pliant.io/internship/2020/backend/a2/input*, calculates the minimum difference and publishes the results to
the corresponding output topic. As usual to run the program type:
```sh
make mqtt
```
# Fibonacci
![](img/testing.png)