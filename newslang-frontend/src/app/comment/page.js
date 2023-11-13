"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { headers } from '../../../next.config';
// import { data } from 'autoprefixer';
import swal from "sweetalert";

export default function RootLayout({ children }) {
  const router = useRouter();
  if (typeof window !== "undefined") {
    var token = window.localStorage.getItem("token");
  }
  //최신순 공감순 거르기
  let [Comments, setCommentsData] = useState([]);
  let [orderby, seturl] = useState("like");

  //댓글가져오기
  const page = 1,
    limit = 10;
  useEffect(() => {
    getCommentsData(page, limit);
  }, [orderby]);

  // const getCommentsData = async (page, limit) => {
  //   fetch(`/api/opinions/members/${orderby}?page=${page}&limit=${limit}`, {
  //     method: "GET",
  //     headers: {
  //       "X-AUTH-TOKEN": token,
  //     },
  //   })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     setCommentsData(data.opinions);
  //   });
  // }
  const getCommentsData = async (page, limit) => {
    fetch(`/api/opinions/members/${orderby}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
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
        setCommentsData(data.opinions);
      })
      .catch(err=>console.log(err))
  }

  //의견 삭제
  const deleteHandler = (opinionId) => {
    //로컬스토리지에 저장되어 있는 토큰 받아오기
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
    }

    fetch(`/api/opinions`, {
      method: "DELETE",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ opinionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCommentsData((Comments) =>
          Comments.filter((item) => item.opinionId !== opinionId)
        );
        swal({
          text: data.resultMessage,
          icon: "info",
          timer: 3000,
          buttons: false,
        });
      });
  };

  const MakeOpinionOrderbyButton = () => {
    var likeClassName = "btnLight mr5";
    var recentClassName = "btnLight";

    if (orderby === "like") {
      likeClassName = "btnSelLight mr5";
      recentClassName = "btnLight";
    } else if (orderby === "recent") {
      likeClassName = "btnLight mr5";
      recentClassName = "btnSelLight";
    }

    return (
      <div className="left">
        <button
          type="button"
          className={likeClassName}
          onClick={() => {
            seturl("like");
          }}
        >
          공감순
        </button>
        <button
          type="button"
          className={recentClassName}
          onClick={() => {
            seturl("recent");
          }}
        >
          최신순
        </button>
      </div>
    );
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

      <div className="contentTitleBox">
        <h4>댓글관리</h4>
      </div>

      <div className="tableWrap4">
        <div className="floatBox mt10 mb10">
          {MakeOpinionOrderbyButton()}
          {/* <div className="left">
            <button
              type="button"
              className="btnLight mr5"
              onClick={() => seturl("like")}
            >
              공감순
            </button>
            <button
              type="button"
              className="btnLight"
              onClick={() => seturl("like")}
            >
              최신순
            </button>
          </div> */}
        </div>

        <table className="tableTypeBoard">
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "61%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>공감수</th>
              <th>작성일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Comments.map((comments, index) => {
              return (
                <tr key={comments.opinionId}>
                  <td>{index + 1}</td>
                  <td className="tl">{comments.opinionContent}</td>
                  <td>{comments.likeCount}</td>
                  <td>{comments.opinionCreateDate}</td>
                  <td>
                    <button
                      className="btnRed wid90"
                      type="button"
                      onClick={() => deleteHandler(comments.opinionId)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}