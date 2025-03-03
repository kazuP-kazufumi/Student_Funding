import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Sample funding posts data
const sampleFundings = [
  {
    title: "医学部進学のための資金調達",
    description: "私は高校3年生の山田太郎です。幼い頃から医師になることが夢でした。地域の医療に貢献し、特に小児医療の分野で活躍したいと考えています。\n\n家庭の経済状況により、医学部の学費を工面することが難しい状況です。しかし、医師になるという夢を諦めたくありません。\n\n医学部の6年間で必要な学費と生活費を調達できれば、将来は地域医療に貢献し、支援してくださった方々への恩返しをしていきたいと考えています。\n\n私は高校では生物学と化学で優秀な成績を収め、模擬試験でも医学部合格圏内の点数を取っています。また、地域のボランティア活動にも積極的に参加し、将来の医療従事者としての資質を磨いてきました。\n\nどうか私の夢を応援していただけませんか？",
    userId: "sample1",
    username: "山田太郎",
  },
  {
    title: "海外大学院留学のための支援を求めています",
    description: "私は大学4年生の佐藤花子です。環境工学を専攻しており、持続可能な水資源管理の研究に取り組んでいます。\n\n来年からアメリカの大学院で研究を続けたいと考えていますが、留学費用が大きな壁となっています。奨学金にも応募していますが、全額をカバーすることは難しい状況です。\n\n私の研究テーマは、特に発展途上国における水資源の効率的な利用方法と浄水技術の開発です。将来は研究成果を実際の問題解決に活かし、水不足に悩む地域の人々の生活改善に貢献したいと考えています。\n\n大学では学部の成績優秀者として表彰され、すでに国内の学会で研究発表も行っています。英語力も高く、TOEFLでは100点以上を取得しています。\n\n留学費用の一部を支援していただければ、必ず良い成果を出し、将来は日本と世界の架け橋となる研究者として活躍することをお約束します。",
    userId: "sample2",
    username: "佐藤花子",
  },
  {
    title: "音楽留学のための資金を募集しています",
    description: "私は高校2年生の鈴木健太です。5歳からピアノを始め、現在はコンクールでの入賞経験もあります。\n\nウィーン音楽院への留学が夢ですが、家庭の経済状況では実現が難しい状況です。音楽の本場で学び、将来は国際的に活躍するピアニストになりたいと考えています。\n\n昨年は全国学生ピアノコンクールで3位に入賞し、地元の音楽祭でもソリストとして演奏する機会をいただきました。音楽教室でのアシスタント講師としても活動しており、子どもたちに音楽の楽しさを伝える活動も行っています。\n\n留学費用を調達できれば、世界レベルの技術と表現力を身につけ、日本の音楽文化の発展に貢献したいと思います。将来は国際コンクールでの入賞を目指すとともに、日本に戻って後進の育成にも力を入れていきたいと考えています。\n\nどうか私の音楽への情熱と可能性を信じて、支援をご検討いただけませんか？",
    userId: "sample3",
    username: "鈴木健太",
  }
];

// Function to add sample data to Firestore
export const addSampleFundings = async () => {
  try {
    for (const funding of sampleFundings) {
      await addDoc(collection(db, 'fundings'), {
        ...funding,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('Sample fundings added successfully');
    return true;
  } catch (error) {
    console.error('Error adding sample fundings:', error);
    return false;
  }
};