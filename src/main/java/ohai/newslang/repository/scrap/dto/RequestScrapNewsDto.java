package ohai.newslang.repository.scrap.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RequestScrapNewsDto {

    private String url;
}
