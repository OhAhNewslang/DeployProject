"use client";
import { useEffect, useState } from "react";
import CalculateLikeCount from "@/app/utils/likecount";
import { useRouter } from "next/navigation";

export default function NewsContents() {
  const router = useRouter();
  let [detailNews, setDetailNews] = useState({});
  let [newsStatus, setNewsStatus] = useState({});
  let [scrapStatus, setScrapStatus] = useState(Boolean);
  let [newsRecommendState, setNewsRecommendState] = useState("");
  let [summaryNews, setSummaryNews] = useState("본문을 요약하고 있습니다.");

  useEffect(() => {
    if (typeof window !== "undefined") {
      RequestDetailNews();
      RequestNewsStatus();
    }
  }, []);

  useEffect(() => {
    RequestSummarizeNews();
  }, []);

  const RequestDetailNews = () => {
    if (typeof window !== "undefined") {
      var newsUrl = window.localStorage.getItem("newsUrl");
    }
    fetch(`/api/news/guest/detail?newsUrl=${newsUrl}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setDetailNews(data.detailNews);
      })
      .catch((err) => console.log(err));
  };

  const RequestSummarizeNews = () => {
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
      var newsUrl = window.localStorage.getItem("newsUrl");
    }
    fetch(`/api/chat/news/summarize?newUrl=${newsUrl}`, {
      // fetch(`/api/chat/news/summarize`, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
      },
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else if (res.status == 500) {
          setSummaryNews("로그인이 필요한 서비스입니다.");
        }
      })
      .then((data) => {
        setSummaryNews(data.answer);
      })
      .catch((err) => {
        console.log("ERR : " + err)
      });
  };

  const RequestNewsStatus = () => {
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
      var newsUrl = window.localStorage.getItem("newsUrl");
    }
    fetch(`/api/news/status?newsUrl=${newsUrl}`, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setScrapStatus(data.memberNewsStatus.scrap);
        setNewsRecommendState(data.memberNewsStatus.recommend);
        setNewsStatus(data.memberNewsStatus);
      })
      .catch((err) => console.log(err));
  };

  const ImageLazyLoading = () => {
    useEffect(() => {
      const imgs = document.querySelectorAll("img");
      imgs.forEach((img) => {
        if (img.className == "_LAZY_LOADING") {
          img.src = img.dataset.src;
        }
      });
    });
  };

  const ScrapButton = (scrap) => {
    if (scrap) {
      return (
        <button className="btnRed wid90" onClick={() => ScrapClick(false)}>
          찜 취소하기
        </button>
      );
    } else {
      return (
        <button className="btnBlue wid90 mr10" onClick={() => ScrapClick(true)}>
          찜하기
        </button>
      );
    }
  };

  const ScrapClick = (scrap) => {
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
      var newsUrl = window.localStorage.getItem("newsUrl");
    }

    fetch("/api/scrap/news", {
      method: scrap ? "POST" : "DELETE",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json",
      },
      //전송할 데이터 json으로 변환해서 body에 넣어줌
      body: JSON.stringify({ newsUrl }),
    })
      .then((res) => {
        if (res.status == 200) {
          setScrapStatus(scrap);
        } else if (res.status == 500) {
          swal({
            text: "로그인이 필요합니다.",
          });
          router.replace("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  const MakeNewsRecommendButton = (recommend) => {
    var likeBtnClassName = "btnBlue wid90 mr10";
    var disLikeBtnClassName = "btnRed wid90 mr10";
    if (recommend == "LIKE") {
      disLikeBtnClassName = "btnUnselRed wid90 mr10";
    } else if (recommend == "DISLIKE") {
      likeBtnClassName = "btnUnselBlue wid90 mr10";
    } else if (recommend == "NONE" || recommend == "") {
      disLikeBtnClassName = "btnUnselRed wid90 mr10";
      likeBtnClassName = "btnUnselBlue wid90 mr10";
    }

    return (
      <div className="fl">
        <button
          type="button"
          className={likeBtnClassName}
          onClick={() => NewsRecommendClick("LIKE")}
        >
          좋아요 {detailNews.likeCount}
        </button>
        <button
          type="button"
          className={disLikeBtnClassName}
          onClick={() => NewsRecommendClick("DISLIKE")}
        >
          싫어요
        </button>
      </div>
    );
  };

  const NewsRecommendClick = (recommend) => {
    if (newsRecommendState == recommend) recommend = "NONE";
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
      var newsUrl = window.localStorage.getItem("newsUrl");
    }

    var status = recommend;

    fetch("/api/recommends/news", {
      method: "POST",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newsUrl, status }),
    })
      .then((res) => {
        if (res.status == 200) {
          var newCnt = CalculateLikeCount(
            newsStatus.recommend,
            recommend,
            detailNews.likeCount
          );
          detailNews.likeCount = newCnt;
          newsStatus.recommend = recommend;
          setDetailNews(detailNews);
          setNewsRecommendState(status);
        } else if (res.status == 500) {
          swal({
            text: "로그인이 필요합니다.",
          });
          router.replace("/login");
        }
      })
      .then((data) => {})
      .catch((err) => console.log(err));
  };

  return (
    <table className="tableTypeBoard2">
      <colgroup>
        <col style={{ width: "13%" }} />
        <col style={{ width: "60%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "17%" }} />
      </colgroup>
      <tbody>
        <tr>
          <th>제목</th>
          <td className="bold">{detailNews.title}</td>
          <th>작성일</th>
          <td>{detailNews.postDateTime}</td>
        </tr>
        <tr>
          <th>작성자</th>
          <td>{detailNews.reporter}</td>
          <th>언론사</th>
          <td>{detailNews.media}</td>
        </tr>
        <tr>
          <th>기사링크</th>
          <td>
            <a href={detailNews.url}>{detailNews.url}</a>
          </td>
          <th>관심</th>
          <td>{ScrapButton(scrapStatus)}</td>
        </tr>
        <tr>
          <th>공감</th>
          <td colSpan="3">
            <div className="floatBox">
              {MakeNewsRecommendButton(newsRecommendState)}
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan="4" className="viewBox">
            <div
              onLoad={ImageLazyLoading()}
              dangerouslySetInnerHTML={{
                __html: `${detailNews.article}`,
              }}
            ></div>
          </td>
        </tr>
        <tr>
          <td colSpan="4" className="viewBox2">
            <h3>
              본문 요약 및 정리
            </h3>
            <br></br>
            <div className="summarize">
              {summaryNews}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
