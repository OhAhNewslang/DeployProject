package ohai.newslang.dto.scrap;

import lombok.*;
import ohai.newslang.domain.RequestResult;
import ohai.newslang.domain.scrap.ScrapNews;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ResultScrapNewsDto {
    private Long memberId;
    private List<ScrapNews> scrapNewsList;
    private RequestResult result;

    @Builder
    public ResultScrapNewsDto(Long memberId, List<ScrapNews> scrapNewsList, RequestResult result) {
        this.memberId = memberId;
        this.scrapNewsList = scrapNewsList;
        this.result = result;
    }
}
