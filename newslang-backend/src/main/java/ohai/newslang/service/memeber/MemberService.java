package ohai.newslang.service.memeber;

import ohai.newslang.domain.dto.member.request.JoinMemberDto;
import ohai.newslang.domain.dto.member.request.LoginMemberDto;
import ohai.newslang.domain.dto.member.request.UpdateMemberDto;
import ohai.newslang.domain.dto.member.request.UpdatePasswordDto;
import ohai.newslang.domain.dto.member.response.MemberInfoDto;
import ohai.newslang.domain.dto.member.response.TokenDto;
import ohai.newslang.domain.dto.request.RequestResult;

public interface MemberService {
    RequestResult createMember(JoinMemberDto joinMemberDto);
    TokenDto logIn(LoginMemberDto loginMemberDto);
    MemberInfoDto readMemberInfo();
    MemberInfoDto updateMemberInfo(UpdateMemberDto memberInfoDto);
    MemberInfoDto updateMemberPassword(UpdatePasswordDto updatePasswordDto);
    RequestResult deleteMember(String password);
}
