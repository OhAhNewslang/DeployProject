"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import swal from "sweetalert";

export default function RootLayout({ children }) {
  const router = useRouter();
  let [scrapNewsList, setScrapNewsList] = useState([]);

  //스크랩 목록가져오기
  const page = 1,
    limit = 10;
  useEffect(() => {
    getScrapData(page, limit);
  }, []);

  // useEffect(() =>{
  // },[scrapNewsList])

  function getScrapData(page, limit) {
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
    }
    fetch(`/api/scrap/news?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
    })
      .then((res) => {
        if (res.status == 200)
          return res.json();
        else if (res.status == 500) {
          swal({
            text: "로그인이 필요합니다.",
          });
          router.replace("/login");
        }
      })
      .then((data) => {
        const code = data.result.resultCode;
        const msg = data.result.resultMessage;
        switch (code) {
          case "200":
            // console.log(data.scrapNewsList);
            setScrapNewsList(data.scrapNewsList);
            //화면 새로고침
            router.refresh();
            break;
          case "404": //스크랩 뉴스없음
            swal({
              text: msg,
              icon: "info",
              timer: 3000,
              button: false,
            });
            router.refresh();
            break;
          default: //로그인정보없음
            router.refresh();
            swal({
              text: msg,
              icon: "warning",
              timer: 3000,
              button: false,
            });
            break;
        }
      })
      .catch(err => console.log(err));
  }

  const makeCancelScrapButton = (newsUrl) => {
    return (
      <button
        className="btnUnselRed"
        type="button"
        onClick={() => deleteHandler(newsUrl)}
      >
        취소
      </button>
    );
  };

  //댓글 삭제
  const deleteHandler = (newsUrl) => {
    //로컬스토리지에 저장되어 있는 토큰 받아오기
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
    }

    fetch(`/api/scrap/news`, {
      method: "DELETE",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newsUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        // alert(data.result.resultMessage + "\r\n" + newsUrl);
        setScrapNewsList((scrapNewsList) =>
          scrapNewsList.filter((item) => item.newsUrl !== newsUrl)
        );
      });
  };

  return (
    <div className="wrap">
      <div className="floatBox mb50">
        <div className="fr">
          <Link href="/resign">
            <button type="button" className="btnLight mr5">
              내프로필
            </button>
          </Link>
          <Link href="/myinfo">
            <button type="button" className="btnLight mr5">
              구독관리
            </button>
          </Link>
          <Link href="/like">
            <button type="button" className="btnLight mr5">
              찜한기사
            </button>
          </Link>
          <Link href="/comment">
            <button type="button" className="btnLight mr5">
              댓글관리
            </button>
          </Link>
        </div>
      </div>

      <div className="tableWrap4">
        <table className="tableTypeBoard">
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "45%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>언론사</th>
              <th>작성자</th>
              <th>작성일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {scrapNewsList.map((news, index) => {
              return (
                <tr key={news.newsUrl}>
                  <td>{index + 1}</td>
                  <td className="tl">
                    <a
                      href={`/view?newsUrl=${news.newsUrl}`}
                      onClick={() => {
                        localStorage.setItem("newsUrl", news.newsUrl);
                      }}
                    >
                      {news.title}
                    </a>
                    {/* <a href={news.newsUrl}>{news.title}</a> */}
                  </td>
                  <td>{news.mediaName}</td>
                  <td>{news.reporter}</td>
                  <td>{news.postDateTime}</td>
                  <td>{makeCancelScrapButton(news.newsUrl)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
