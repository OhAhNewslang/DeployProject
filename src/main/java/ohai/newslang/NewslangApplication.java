package ohai.newslang;

import org.aspectj.lang.annotation.Before;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class NewslangApplication {

	public static void main(String[] args) {
		SpringApplication.run(NewslangApplication.class, args);
	}

}
