package ohai.newslang.domain.entity.recommend;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ohai.newslang.domain.entity.TimeStamp;
import ohai.newslang.domain.entity.opinion.Opinion;
import ohai.newslang.domain.enumulate.RecommendStatus;

import jakarta.persistence.*;
import org.springframework.boot.web.embedded.undertow.UndertowWebServer;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OpinionRecommend extends TimeStamp {

    @Id @GeneratedValue
    @Column(name = "opinion_recommend_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_recommend_id")
    private MemberRecommend memberRecommend;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opinion_id")
    private Opinion opinion;

    @Enumerated(EnumType.STRING)
    private RecommendStatus status;

    //연관 관계 메서드
    public void foreignMemberRecommend(MemberRecommend newMemberRecommend) {
        memberRecommend = newMemberRecommend;
        memberRecommend.getOpinionRecommends().add(this);
    }

    public void foreignOpinion(Opinion newOpinion) {
        opinion = newOpinion;
        opinion.getOpinionRecommends().add(this);
    }

    //비즈니스 로직
    public static OpinionRecommend createOpinionRecommend(MemberRecommend newMemberRecommend,
                                                   Opinion newOpinion,
                                                   RecommendStatus newStatus) {

        OpinionRecommend opinionRecommend = new OpinionRecommend();

        opinionRecommend.foreignMemberRecommend(newMemberRecommend);
        opinionRecommend.foreignOpinion(newOpinion);
        opinionRecommend.status = RecommendStatus.NONE;
        opinionRecommend.updateStatus(newStatus);
//        opinionRecommend.status = newStatus;

        return opinionRecommend;
    }

    public void updateStatus(RecommendStatus newStatus) {
        opinion.updateLikeCount(countStatus(status, newStatus));
        status = newStatus;
    }

    // 댓글 추천 정보를
    private int countStatus(RecommendStatus status, RecommendStatus newStatus) {
        // 업데이트 할 추천 정보와 현재 추천 정보가 서로 같으면 0을 리턴해 무시
        // 같지 않다면 새로운 정보가 "LIKE"인지 확인하고 맞으면 OTHER -> LIKE 이므로 1 리턴
        // 아니면 "LIKE" -> OTHER 이므로 -1 리턴
        // none -> dislike = 0
        // like -> other = -1
        // other -> like = +1
        return status.equals(newStatus) ? 0 :
                status.equals(RecommendStatus.LIKE) ? -1
                        : newStatus.equals(RecommendStatus.LIKE) ? 1 : 0;
        // 서로 같으면 변경이 없었으므로 0
        // 같지 않은데 이전 값이 Like면 Like가 취소 되거나 DisLike가 된것이므로 -1
        // 같지 않은데 이전 값이 None, DisLike일 때 새로 들어온 값이 Like면 + 1
        // 나머지 경우(none -> dislike, dislike -> none)면 0
    }

    public static OpinionRecommend getNoneRecommend(){
        OpinionRecommend opinionRecommend = new OpinionRecommend();

        opinionRecommend.opinion = null;
        opinionRecommend.memberRecommend = null;
        opinionRecommend.status = RecommendStatus.NONE;

        return opinionRecommend;
    }
}
