'use client'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './globals.css'

export default function RootLayout({ children }) {
  const router = useRouter();
  let [loginbtnText, setLoginBtnText] = useState(["Login"])
  let [MyPageText, setMyPageBtnText] = useState(["Signin"])

  //로그인 유무 확인을 위한 토큰 가져오기
  if (typeof window !== "undefined") {
    var token = window.localStorage.getItem('token');
  }

  //로그인되어있으면 버튼Logout으로 변경
  useEffect(() => {
    if (token) {
      setLoginBtnText("Logout");
      setMyPageBtnText("MyPage");
    }else{
      setLoginBtnText("Login");
      setMyPageBtnText("Signin");
    }
  });


  //로그인 로그아웃 버튼 구현
  function LoginhandleClick() {
    if (!token) { //로그인이 안되어 있으면
      //로그인 페이지로 라우팅
      router.refresh();
      router.push("/login");
    } else { //로그인이 되어 있으면
      router.refresh();
      router.push("/");
      localStorage.setItem('token','');
    }
  }

  //마이페이지 버튼 구현
  function MypagehandleClick() {
    if (!token) { //로그인이 안되어있으면
      //로그인 페이지로 라우팅
      router.push("/signin")
    } else { //로그인이 안되어 있으면
      router.push("/myinfo");
    }
  }

  return (
    <html>
      <head>
        <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="js/common.js"></script>
      </head>
      <body>

        <div className="wrap">

          <div className="logoBox">
            <a href="/"><img src="images/logo.jpg" alt="logo" /></a>
            <div className="floatBox mb15">
              <div className="fr">
                <Link href="/"><button type="button" className="btnBlue mr5">Home</button></Link>
                <button type="button" className="btnBlue mr5" onClick={() => MypagehandleClick()}>{MyPageText}</button>
                <button type="button" className="btnGray" onClick={() => LoginhandleClick()}>{loginbtnText}</button>

              </div>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
