"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { headers } from "../../next.config";
import { useEffect, useState } from "react";
import swal from "sweetalert";

export default function Home() {
  const router = useRouter();
  let [subThumbnailNewsList, setSubThumbnailNews] = useState([]);
  let [liveThumbnailNewsList, setLiveThumbnailNews] = useState([]);
  let [LoginBox, setLoginBox] = useState("");
  

  if (typeof window !== "undefined") {
    var token = window.localStorage.getItem("token");
  }

  //메인뉴스 페이징
  const limit = 7;
  const itemsPerPage = 1; // 페이지당 아이템 수를 정의
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지를 관리
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  const indexOfLastItem = currentPage * itemsPerPage;

  
  //페이지를 변경하도록 설정
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //페이지 번호 목록을 생성하여 페이지네이션 버튼을 렌더링할 때 사용
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  //구독뉴스 페이징
  const [subcurrentPage, setSubCurrentPage] = useState(1); //현재 페이지를 관리
  const subitems = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  const subindexOfLastItem = subcurrentPage * itemsPerPage;

  //페이지를 변경하도록 설정
  const subpaginate = (subpageNumber) => {
    setSubCurrentPage(subpageNumber);
  };

  //페이지 번호 목록을 생성하여 페이지네이션 버튼을 렌더링할 때 사용
  const subpageNumbers = [];
  for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
    subpageNumbers.push(i);
  }

  useEffect(() => {
    getLiveData(currentPage, limit);
  }, [currentPage]);

  useEffect(() => {
    getSubData(subcurrentPage, limit);
  }, [subcurrentPage]);

  //구독뉴스가져오기
  function getSubData(page, limit) {
    fetch(`/api/news/subscribe?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setLoginBox("none");
          return res.json();
        } else if (res.status === 500) {
          router.refresh();
          setLoginBox("");
        }
      })
      .then((data) => {
        if (
          data.thumbnailNewsList !== "undefined" &&
          data.thumbnailNewsList.length > 0
        ) {
          setSubThumbnailNews(data.thumbnailNewsList);
        }
      })
      .catch((err) => console.log(err));
  }

  const getLiveData = async (page, limit) => {
    fetch(`/api/news/guest/live?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data.thumbnailNewsList !== "undefined" &&
          data.thumbnailNewsList.length > 0
        ) {
          setLiveThumbnailNews(data.thumbnailNewsList);
        }
      });
  };

  return (
    <div className="wrapex">
      <div className="wrap2">
        <div className="contentTitleBox">
          <h3>#구독</h3>
        </div>

        <div className="tableWrap2">
          <table className="tableTypeBoard">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "65%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>사진</th>
                <th>제목</th>
                <th>언론사</th>
              </tr>
            </thead>
            <tbody style={{ width: "450px", height: "535px" }}>
              <tr className="noLoginBox" style={{ display: LoginBox }}>
                <td className="noLoginChild">
                  로그인 후 이용해주세요.
                  <br />
                  <Link href="/login">
                    <button type="button" className="btnBlue mr5">
                      로그인하러 가기
                    </button>
                  </Link>
                </td>
              </tr>

              {subThumbnailNewsList.map((news, index) => {
                return (
                  <tr key={index}>
                    <td style={{ height: "76px" }}>
                      <a
                        href={`/view?newsUrl=${news.url}`}
                        onClick={() => {
                          localStorage.setItem("newsUrl", news.url);
                        }}
                      >
                        <img src={news.imagePath} />
                      </a>
                    </td>
                    <td className="tl">
                      <a
                        href={`/view?newsUrl=${news.url}`}
                        onClick={() => {
                          localStorage.setItem("newsUrl", news.url);
                        }}
                      >
                        {news.title}
                      </a>
                    </td>
                    <td>{news.media}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pagingBox">
          <ul className="paging">
            <li>
              <a
                onClick={() => setSubCurrentPage(subcurrentPage - 1)}
                disabled={subcurrentPage === 1}
              >
                이전
              </a>
            </li>

            {subpageNumbers.map((number) => (
              <li key={number}>
                <a
                  key={number}
                  onClick={() => subpaginate(number)}
                  className={subcurrentPage === number ? "active" : ""}
                >
                  {number}
                </a>
              </li>
            ))}

            {/* <li><span class="active"></span></li> */}
            <li>
              <a
                onClick={() => setSubCurrentPage(subcurrentPage + 1)}
                disabled={subindexOfLastItem >= subitems.length}
              >
                다음
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap2">
        <div className="contentTitleBox">
          <h3>#최신 뉴스</h3>
        </div>
        <div className="tableWrap">
          <table className="tableTypeBoard">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "65%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>사진</th>
                <th>제목</th>
                <th>언론사</th>
              </tr>
            </thead>
            <tbody style={{ width: "450px", height: "535px" }}>
              {liveThumbnailNewsList.map((news, index) => {
                return (
                  <tr key={index}>
                    <td style={{ height: "76px" }}>
                      <a
                        href={`/view?newsUrl=${news.url}`}
                        onClick={() => {
                          localStorage.setItem("newsUrl", news.url);
                        }}
                      >
                        <img src={news.imagePath} />
                      </a>
                    </td>
                    <td className="tl">
                      <a
                        href={`/view?newsUrl=${news.url}`}
                        onClick={() => {
                          localStorage.setItem("newsUrl", news.url);
                        }}
                      >
                        {news.title}
                      </a>
                    </td>
                    <td>{news.media}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagingBox">
          <ul className="paging">
            <li>
              <a
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </a>
            </li>

            {pageNumbers.map((number) => (
              <li key={number}>
                <a
                  key={number}
                  onClick={() => paginate(number)}
                  className={currentPage === number ? "active" : ""}
                >
                  {number}
                </a>
              </li>
            ))}

            {/* <li><span class="active"></span></li> */}
            <li>
              <a
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastItem >= items.length}
              >
                다음
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
