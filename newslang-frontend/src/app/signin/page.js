'use client'
import React from 'react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import swal from 'sweetalert';

export default function RootLayout({ children }) {
    const router = useRouter();

    //비밀번호 일치 
    let [pwdcheckmsg, setpwdmsgData] = useState([])
    const [buttonshow, setShow] = useState(false);
    function pwdcheck() {
        const pwd = document.getElementById("password").value
        const pwdcheck = document.getElementById("passwordcheck").value

        if (pwd == pwdcheck) {
            setpwdmsgData("* 비밀번호가 일치합니다.");
            setShow(true);
        } else {
            setpwdmsgData("! 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
            setShow(false);
        }
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            //폼 name값 변수저장
            const name = e.target.name.value;
            const loginId = e.target.loginId.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            //fetch로 보낼 옵션들
            const options = {
                method: 'POST',
                headers: {
                    //json타입으로 전송
                    'Content-Type': 'application/json'
                },
                //전송할 데이터 json으로 변환해서 body에 넣어줌
                body: JSON.stringify({ name, loginId, email, password })
            }
            fetch('api/members/new', options) //경로 및 옵션들
                .then(res => res.json())
                .then(data => {
                    const code = data.resultCode;
                    const loginmsg = data.resultMessage;
                    switch (code) {
                        case '201'://회원가입 성공
                            router.push("/login");
                            swal({
                                title: loginmsg,
                                text: "로그인해주세요",
                                icon: "success",
                                button: "확인",
                              });
                            break;
                        case '202'://중복가입
                            router.refresh();
                            swal({
                                title: loginmsg,
                                text: "로그인해주세요",
                                icon: "info",
                                button: "확인",
                              });
                            break;
                    }
                });

        }}>

            <div className="joinTable">
                <div className="contentTitleBox">
                    <h4>회원가입</h4>
                </div>
                <table className="tableTypeSort">
                    <colgroup>
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '30%' }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>이름</th>
                            <td colSpan="3">
                                <input type="text" className="wid200" id="name" name="name" />
                            </td>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td colSpan="3">
                                <input type="text" className="wid200" id="loginId" name="loginId" />
                                <p className="mt3">* 5자리 이상의 영문 및 숫자, 영문숫자 혼용만 가능합니다.</p>
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호</th>
                            <td colSpan="3">
                                <input type="password" className="wid200" id="password" name="password" />
                                <p className="mt3">
                                    * 비밀번호는 암호화되어 빈 란으로 보입니다.
                                </p>
                                <p className="mt3">* 5자리 이상의 영문숫자 혼용만 가능합니다.</p>
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호 확인</th>
                            <td colSpan="3">
                                <input type="password" className="wid200" id="passwordcheck" name="passwordcheck" onChange={pwdcheck} />
                                <p>
                                    * 확인을 위해 위에 입력하신 비밀번호를 한번 더 입력해 주세요.
                                </p>
                                <p>
                                    {pwdcheckmsg}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td colSpan="3">
                                <input type="text" className="wid200" id="email" name="email" />
                                <p>
                                    * 아이디/비밀번호 찾기 시 사용될 정보입니다. 정확하게 입력해 주세요.
                                </p>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <div className="centerBox mt20">
                    { buttonshow &&<button type="submit" className="btnBlue wid90">회원가입</button>}
                </div>
            </div>
        </form>
    )
}