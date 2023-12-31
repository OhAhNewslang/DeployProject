package ohai.newslang.configuration.jwt;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;


public interface TokenDecoder {
    void init();
    // id -> memberId
    String createToken(String id, String role);
    Authentication getAuthentication(String token);
    // 추출한 토큰에서 memberId 가져오기
    Long tokenToId(String token);
    // 추출한 토큰에서 memberRole 가져오기
    String tokenToRole(String token);
    // 토큰 추출(우리의 경우 세션에서)
    String resolveToken(HttpServletRequest req);
    // 토큰 유효기간 검사
    boolean expiredToken(String token);
    // 현재 로그인한 사용자 정보 가져오기
    Long currentMemberId();
}