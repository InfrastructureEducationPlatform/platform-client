import { Button, Card, Carousel, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const contentStyle: React.CSSProperties = {
    height: '75vh',
    color: '#fff',
    lineHeight: '75vh',
    textAlign: 'center',
    background: '#364d79',
  };

const defaultImgUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

// Carousel 안에 카드 형식의 컨텐츠.
export function CarouselContents({title, contents,imgUrl}: {title: string, contents: string[],imgUrl: string}){
    if(imgUrl === ''){
        imgUrl= defaultImgUrl;
    }
    return(
        <Card
            bordered = {false}
            style={{ width: 400, minHeight: '55vh', padding: 20}}
            cover={<img src={imgUrl} style={{height: '30vh'}}/>}
            >
            <Typography.Title level={3}>{title}</Typography.Title>
            <Typography.Text>
            <ul>
                {contents.map((content) => <li>{content}</li>)}
            </ul>
            </Typography.Text>
        </Card> 
    );
}

// Carousel 안의 전체 화면 컨텐츠로 들어감.
export function CarouselFullContents({title, contents,imgUrl}: {title: string, contents: string,imgUrl: string}){
    if(imgUrl === ''){
        imgUrl = defaultImgUrl;
    }
    return(
        <Flex>
            <Flex style={{height: '75vh', width: '100vw', flexDirection:'column-reverse', backgroundImage: `url(${imgUrl})`, backgroundSize:'auto 100%', backgroundRepeat: 'no-repeat'}}>
                <Typography.Text type="secondary" style={{paddingLeft: 30, paddingBottom: 100, fontSize:20, }}>{contents}</Typography.Text>
                <Typography.Title style={{paddingLeft: 30}}>{title}</Typography.Title>
            </Flex>
        </Flex>
        
    );
}

// Carousel, 왼쪽에는 설명, 오른쪽에 이미지.
export function CarouselLeftDescriptionContents({title, contents,imgUrl}: {title: string, contents: string,imgUrl: string}){
    if(imgUrl === ''){
        imgUrl= defaultImgUrl;
    }
    return(
        <Flex style={{height: '75vh',width: '100vw'}}>
            <Flex style={{flex:1, backgroundColor: '#848484'}}>
                <div style={{padding: '2vw'}}>
                    <Typography.Title>
                        {title}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{fontSize: 20}}>
                        {contents}
                    </Typography.Text>
                </div>
            </Flex>
            <Flex style={{ flex: 3 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} src={imgUrl} />
            </div>
            </Flex>
        </Flex>
    )
}