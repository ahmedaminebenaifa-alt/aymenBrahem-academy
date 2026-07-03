import React from 'react';
import sheikhImage from '../assets/AymenBrahem.png';
import './LandingPage.css'

export default function LandingPage({ onNavigateToAuth }) {
  return (
    <header className="hero-section-full">
        <div className='title-section'>
            <div className="islamic-ornament">❖ ❖ ❖</div>
            <div className="title-section-landing">
                <h1>أكاديمية أيمن إبراهيم</h1>
            </div>
        </div>
      <div className="hero-split-container">
        
        {/* الجانب الأيمن: صورة الشيخ مع الزخرفة الإسلامية */}
        <div className="hero-image-block">
          <div className="sheikh-image-wrapper">
            <svg className="islamic-bg-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="#f5efe6" stroke="#b38f56" strokeWidth="2" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="#b38f56" strokeWidth="0.7" strokeDasharray="4 3" />
            </svg>
            <img src={sheikhImage} alt="فضيلة الشيخ أيمن إبراهيم" className="sheikh-avatar-img" />
          </div>
        </div>

        {/* الجانب الأيسر: المقدمة المنبثقة */}
        <div className="hero-text-block-emerge">
          
          <p className="hero-tagline">
            صرح تعليمي رائد يهدف إلى بناء جيل متسلح بالوعي والمعرفة، متصل بهويته الإسلامية الأصيلة عبر مناهج تعليمية متكاملة تحت إشراف نخبة من المتخصصين.
          </p>

          <div className="academy-pillars">
            {/* القرآن الكريم */}
            <div className="pillar-card">
              <div className="pillar-icon">
                <svg className="pillar-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 46L32 54L50 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 50L12 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M42 50L52 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M32 20C24 14 12 15 6 18V40C12 37 24 36 32 42C40 36 52 37 58 40V18C52 15 40 14 32 20Z" fill="#fffdfa" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32 20V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>القرآن الكريم</h3>
              <p>تحفيظ، تجويد، وضبط مخارج الحروف بأحكام التلاوة والترتيل الأصيل.</p>
            </div>
            {/* اللغة العربية */}
            <div className="pillar-card">
              <div className="pillar-icon">
                <svg className="pillar-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 42H30V54H12V42Z" fill="#fffdfa" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M16 42V38H26V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="21" cy="48" r="2.5" fill="currentColor" opacity="0.4"/>
                  <path d="M54 10C50 10 34 22 30 32C29.5 33.5 30 35 31 36C32 37 33.5 37.5 35 37L45 31C53 25 54 14 54 10Z" fill="#fffdfa" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 32L22 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>اللغة العربية</h3>
              <p>تعليم لغة الضاد، قواعد النحو، والبلاغة، والقراءة والكتابة السليمة.</p>
            </div>
            {/* العلوم الشرعية */}
            <div className="pillar-card">
              <div className="pillar-icon">
                <svg className="pillar-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 9C32 9 31 13 31 15C23 16 14 23 14 35V46H50V35C50 23 41 16 32 15C32 13 32 9 32 9Z" fill="#fffdfa" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 46H55V52H9V46Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 41V34C21 31.5 22.8 29.5 25 29.5C27.2 29.5 29 31.5 29 34V41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M35 41V34C35 31.5 36.8 29.5 39 29.5C41.2 29.5 43 31.5 43 34V41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M34.5 4C32.5 4 31 5.5 31 7.5C31 9.5 32.5 11 34.5 11C33.2 11 32.2 10.2 32.2 7.5C32.2 4.8 33.2 4 34.5 4Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>العلوم الشرعية</h3>
              <p>تأصيل الفقه المبسط، السيرة النبوية العطرة، والآداب والتربية الإسلامية.</p>
            </div>
          </div>
          
          <div className="cta-box-landing">
            <p>لرؤية تفاصيل الدورات المتاحة وتجهيز مسارك الفقهي والعلمي المخصص، تفضل بالانتقال للأسفل لتسجيل حسابك.</p>
            <div className="cta-buttons">
              <button onClick={() => onNavigateToAuth('login')} className="btn-primary">تسجيل الدخول سريعا ↓</button>
              <button onClick={() => onNavigateToAuth('signup')} className="btn-secondary">إنشاء حساب جديد ↓</button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}