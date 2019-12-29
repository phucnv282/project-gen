package maven_template;

import other_package.*;

public class App {
    public static void main(String[] args) {
        Greeter greeter = new Greeter();
        Example example = new Example();

        System.out.println(greeter.sayHello());
        example.log("Other Package Test");
    }
}
