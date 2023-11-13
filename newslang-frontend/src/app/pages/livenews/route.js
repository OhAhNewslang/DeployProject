import {NextResponse} from "next/server";

export async function GET(req,res) {
    //token
    if (typeof window !== "undefined") {
        var token = window.localStorage.getItem('token');
      }
     //최신뉴스 api호출
     fetch('/api/news/live?page=${page}&limit=${limit}', {
        method: 'GET',
        headers: {
          'X-AUTH-TOKEN': token,
          'page': 1,
          'limit': 10
        }
      })
      return NextResponse.json(res);
  }