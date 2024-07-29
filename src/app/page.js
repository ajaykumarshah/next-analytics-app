
import Image from "next/image";
import styles from "./page.module.css";
import homeImage from "@/static/media/images/png/home_page_background.webp";
import dynamic from "next/dynamic";
import HomePageModal from "@/pages/HomePageModal";
import { redirect } from 'next/navigation'


export default function Home() {
  // redirect("/querypage")
  return (
    <>
      <div className={styles.main}>
        {/* <Image src={homeImage} height={852} width={1800} alt="g" /> */}
      </div>
      
      <div>
        <HomePageModal />
      </div>
    </>
  );
}
