package ohai.newslang.domain.dto.member.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginMemberDto {

    @NotBlank(message = "아이디를 입력해 주세요")
    private String loginId;

    @NotBlank(message = "비밀번호를 입력해 주세요.")
    private String password;
}
