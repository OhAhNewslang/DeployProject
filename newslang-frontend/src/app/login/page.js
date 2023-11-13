'use client'
import { useRouter } from "next/navigation";
import { headers } from "../../../next.config";
import { useState } from "react";


export default function RootLayout({ children }) {
	const router = useRouter();
	let [loginmsg, setLoginmsgData] = useState([])
	return (

		<form onSubmit={(e) => {
			e.preventDefault();
			//폼 name값 변수저장
			const loginId = e.target.loginId.value;
			const password = e.target.password.value;
			//fetch로 보낼 옵션들
			const options = {
				method: 'POST',
				headers: {
					//json타입으로 전송
					'Content-Type': 'application/json'
				},
				//전송할 데이터 json으로 변환해서 body에 넣어줌
				body: JSON.stringify({ loginId, password }),
				//ssr 옵션 추가
				cache: 'no-store'
			}
			fetch('api/members/in', options) //경로 및 옵션들 보냄
				.then(res => res.json())
				.then(data => {
					const code = data.result.resultCode;
					const loginmsg = data.result.resultMessage;
					switch (code) {
						case '200':
							localStorage.setItem('token', data.token);
							router.push("/");
							//화면 새로고침
							router.refresh();
							break;
						case '202'://비밀번호틀림
							setLoginmsgData(loginmsg);
							router.refresh();
							break;
						default://로그인정보없음
							setLoginmsgData(loginmsg);
							router.refresh();
							break;
					}
				});
		}}>
	<div className="wrap">
		<div className="login1">
			<h1>
				<img src="images/logo.jpg" alt="milan information system" />
			</h1>
			<div className="loginBox">
				<input name="loginId" placeholder="아이디" />
				<input type="password" name="password" placeholder="비밀번호" />
				<div>
					<input type="checkbox" className="save" name="key" />
					<label>아이디 저장</label>
					<input type="checkbox" className="save" name="pass" />
					<label>비밀번호 저장</label>
				</div>
				<a href="/signin">회원가입</a>
				<p class="loginresult">{loginmsg}</p>
				<button type="submit" className="btnLogin">버튼</button>
			</div>
		</div>
	</div>
		</form >
	)
}