import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Blog/Blog.module.css";
import axiosInstance from "../../api/axios";
import Compressor from 'compressorjs';

const NEWS_URL = "/hackathons/all";

export default function Find() {
  const [news, setNews] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(NEWS_URL, null, {
          headers: { "Content-Type": "application/json" },
        });
        setNews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const compressImage = (blob) => {
    return new Promise((resolve, reject) => {
      new Compressor(blob, {
        quality: 0.6,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  const NewsCard = ({ nws }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      const fetchImage = async () => {
        try {
          const response = await axiosInstance.get(`/hackathons/image/${nws.id}`, {
            responseType: 'blob',
          });

          const compressedImage = await compressImage(response.data);
          const imageUrl = URL.createObjectURL(compressedImage);
          setImageUrl(imageUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };

      fetchImage();
    }, [nws.id]);

    return (
      <div key={nws.id} className={styles.card}>
        <div>
          <div className={styles.card_block}>
            <div className={styles.picture}>
              {imageUrl ? (
                <img src={imageUrl} alt="Картинка" className={styles.avatar} />
              ) : (
                <p>Loading image...</p>
              )}
            </div>
            <div className={styles.description2}>
              <div className={styles.team_name}>
                <p className={styles.team_name_text}>{nws.title}</p>
              </div>
              <div className={styles.team_goal}>
                <p className={styles.team_goal_text}>{nws.description}</p>
              </div>
              <div className={styles.team_goal}>
                <a href={nws.link} target="_blank" rel="noreferrer">
                  Подробнее
                </a>
              </div>
              {nws.postTags.length > 0 && (
                <p className={styles.team_goal_text}>Теги:</p>
              )}
              <div className={styles.team_stack}>
                {nws.postTags.map((tag, index) => (
                  <p key={index} className={styles.skill}>{tag.nameTags}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.search_page}>
      <Header />
      <div className={styles.grid_container}>
        <div className={styles.bgcolor}>
          <div className={styles.description}>
            <div className={styles.search_card}>
              <div className={styles.cards}>
                {news.map((item) => (
                  <NewsCard nws={item} key={item.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
