## 회원 API

### 1. 회원 가입

`POST /join` - status 201

**Request** :

```text
{
    email : "사용자가 입력한 이메일",
    password : "사용자가 입력한 비밀번호"
}
```

**Response** : 없음

<br/>

### 2. 로그인

`POST /login` - status 200

**Request** :

```text
{
    email : "사용자의 이메일",
    password : "사용자의 비밀번호"
}
```

**Response** : JWT Token

<br/>

### 3. 비밀번호 초기화 요청

`POST /reset` - status 200

**Request** :

```text
{
    email : "사용자의 이메일"
}
```

**Response** : 없음

<br/>

### 4. 비밀번호 초기화 (== 수정)

`PUT /reset` - status 201

**Request** :

```text
{
    password : "사용자가 입력한 새 비밀번호"
}
```

**Response** : 없음

<br/>

<br/>

## 도서 API

### 1. 전체 도서 조회 - 8개씩 보내주기

`GET /books` - status 200

**Request** :

```text
[
    {
        id : 도서 id,
        title : "도서 제목",
        summary : "요약 설명",
        author : "도서 작가",
        price : 가격,
        likes : 좋아요 수,
        pubDate : "출간일"
    },
    
        id : 도서 id,
        title : "도서 제목",
        summary : "요약 설명",
        author : "도서 작가",
        price : 가격,
        likes : 좋아요 수,
        pubDate : "출간일"
    },
    ... 
]
```

<br/>

### 2. 개별 도서 조회 - 이미지 경로

`GET /books/{bookId}` - status 200

**Request** : 없음

**Response** :

```text
{
    id : 도서 id,
    title : "도서 제목",
    category : "카테고리",
    format : "형식",
    isbn : "isbn",
    summary : "요약 설명",
    description : "상세 설명",
    author : "도서 작가",
    pages : 쪽 수,
    index : "목차",
    price : 가격,
    likes : 좋아요 수,
    liked : boolean,
    pubDate : "출간일"
}
```

<br/>

### 3. 카테고리별 도서 목록 조회 - 8 개씩

`GET /books?categoryId={categoryId}&new={boolean}` - status 200

**Request** : 없음

**Response** :

```text
[
    {
        id : 도서 id,
        title : "도서 제목",
        summary : "요약 설명",
        author : "도서 작가",
        price : 가격,
        likes : 좋아요 수,
        pubDate : "출간일"
    },
    
        id : 도서 id,
        title : "도서 제목",
        summary : "요약 설명",
        author : "도서 작가",
        price : 가격,
        likes : 좋아요 수,
        pubDate : "출간일"
    },
    ...
]
```

<br/>

<br/>

## 좋아요 API

### 1. 좋아요 추가

`POST /likes/{bookId}` - status 200

**Request** : 없음

**Response** : 없음

> 아마 `body` 에 `userId` 가 들어갈 줄 알았는데, <br/>
> JWT 토큰으로 `id` 감지해내고 insert 하는 것 같음.

<br/>

### 2. 좋아요 취소

`DELETE /likes/{bookId}` - status 200

**Request** : 없음

**Response** : 없음

<br/>

<br/>

## 장바구니 API

### 1. 장바구니 담기

`POST /carts` - status 201

**Request** :

```text
{
    book_id : 도서 id,
    quantity : 수량,
    user_id : 유저 id
}
```

**Response** : 없음

<br/>

### 2. 장바구니 조회

`GET /carts` - status 200

**Request** : 없음

**Response** :

```text
[
    {
        cartItemId : 장바구니 도서 id,
        bookId : 도서 id,
        title : "도서 제목",
        summary : "도서 요약",
        quantity : 수량,
        price : 가격
    },
    {
        cartItemId : 장바구니 도서 id,
        bookId : 도서 id,
        title : "도서 제목",
        summary : "도서 요약",
        quantity : 수량,
        price : 가격
    },
    ...
]
```

<br/>

### 3. 장바구니 도서 삭제

`DELETE /carts/{id}` - status 200

**Request** : 없음

**Response** : 없음

<br/>

### 4. (장바구니에서 선택한) 주문 "예상" 상품 목록 조회

`GET /carts` - status 200

**Request** :

```text
{
    user_id : 유저 id,
    isSelectedArr : [ cartItemId, cartItemId, ... ] 
}
```

**Response** :

```text
[
    {
        cartItemId : 장바구니 도서 id,
        bookId : 도서 id,
        title : "도서 제목",
        summary : "도서 요약",
        quantity : 수량,
        price : 가격
    },
    {
        cartItemId : 장바구니 도서 id,
        bookId : 도서 id,
        title : "도서 제목",
        summary : "도서 요약",
        quantity : 수량,
        price : 가격
    },
    ...
]
```

<br/>

<br/>

## 결제(주문) API

### 1. 결제하기 - 주문하기 - 주문 등록 - 데이터베이스 주문 insert

==> 장바구니에서 주문된 상품들을 delete 해야한다.

`POST /orders` - status 200

**Request** :

```text
{
    items : [
        {
            cartItemId : 장바구니 도서 id,
            bookId : 도서 id,
            quantity : 수량
        },
        }
            cartItemId : 장바구니 도서 id,
            bookId : 도서 id,
            quantity : 수량
        },
        ...
    ],
    delivery : {
        address : "주소",
        receiver : "이름",
        contact : "010-0000-0000"
    },
    totalPrice : 총 금액,
    totalQuantity : 총 개수,
    userId : 유저 id - 나중에 jwt 파싱되어 꺼내져야 함,
    firstBookTitle : "대표 책 타이틀 "
}
```

**Response** : 없음

<br/>

### 2. 주문 목록(내역) 조회

`GET /orders` - status 200

**Request** :


**Response** :

```text
[
    {
        order_id : 주문 id,
        created_at : "주문일자",
        delivery : {
            address : "주소",
            receiver : "이름",
            contact : "010-0000-0000"
        },
        bookTitle : "대표 책 제목",
        totalPrice : 결제 금액,
        totalCount : 총 수량 
    }
]
```

<br/>

### 3. 주문 상세 상품 조회

`GET /orders/{orderId}` - status 200

**Request** : 없음

**Response** :

```text
[
    {
        bookId : 도서 id,
        bookTitle : "도서 제목",
        author : "작가명",
        price : 가격,
        count : 수량
    },
    {
        bookId : 도서 id,
        bookTitle : "도서 제목",
        author : "작가명",
        price : 가격,
        count : 수량
    }, 
    ...
]
```
