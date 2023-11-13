"use client";
import Link from "next/link";
import NewsContents from "../components/detailnews/newscontents";
import NewsOpinion from "../components/detailnews/newsopinion";

export default function RootLayout() {
  return (
    <div className="wrap">
      <div className="tableWrap3">
        <NewsContents />
        <NewsOpinion />
        <div className="fr mt10">
          <Link href="/">
            <button type="button" className="btnLight wid90">
              목록
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
