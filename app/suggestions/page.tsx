// "use client";

// import { useEffect, useState } from "react";
// import styles from "./suggestions.module.css";
// import Loader from "../components/Loader/Loader";
// import RoleCard from "../components/RoleCard/RoleCard";
// import WhyBox from "../components/WhyBox/WhyBox";
// import RiskBars from "../components/RiskBars/RiskBars";
// import { useAppState } from "../lib/useAppState";
// import { postRecommend, RecommendResponse } from "../lib/api";
// import { useRouter } from "next/navigation";

// export default function SuggestionsPage() {
//   const { state } = useAppState();
//   const router = useRouter();
//   const [data, setData] = useState<RecommendResponse | null>(null);
//   const [err, setErr] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!state.path || !state.country || !state.age) {
//       router.push("/profile");
//       return;
//     }

//     (async () => {
//       try {
//         setLoading(true);
//         setErr(null);
//         const res = await postRecommend({
//           path: state.path,
//           country: state.country,
//           age: state.age,
//           skills: state.skills,
//           language: state.language,
//           equityFlag: state.equityFlag,
//         });
//         setData(res);
//       } catch (e: any) {
//         setErr(e?.message || "Failed to load recommendations");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [state, router]);

//   function copyPlan() {
//     if (!data) return;
//     const lines = data.recommendations.map((r, i) => 
//       `#${i + 1} ${r.title}\n${r.why}\nSteps:\n${r.microlearning.map(m => `- ${m.title}: ${m.link}`).join("\n")}`
//     );
//     const txt = `Next Earth plan for ${state.country}\n\n${lines.join("\n\n")}`;
    
//     navigator.clipboard.writeText(txt).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }).catch(() => {
//       alert("Failed to copy to clipboard");
//     });
//   }

//   return (
//     <section className={styles.wrap}>
//       <div className={styles.main}>
//         <div className={styles.header}>
//           <h1 className={styles.h}>Your Climate Action Opportunities</h1>
//           <p className={styles.subheading}>
//             Personalized recommendations based on your profile and location
//           </p>
//         </div>

//         {loading && <Loader label="Finding your best matches…" />}
        
//         {err && (
//           <div className={styles.errorCard}>
//             <svg 
//               width="24" 
//               height="24" 
//               viewBox="0 0 24 24" 
//               fill="none" 
//               stroke="currentColor" 
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="12" r="10" />
//               <line x1="12" y1="8" x2="12" y2="12" />
//               <line x1="12" y1="16" x2="12.01" y2="16" />
//             </svg>
//             <p className={styles.err}>{err}</p>
//           </div>
//         )}

//         {data && data.recommendations.length > 0 && (
//           <>
//             <div className={styles.statsBar}>
//               <div className={styles.stat}>
//                 <span className={styles.statValue}>{data.recommendations.length}</span>
//                 <span className={styles.statLabel}>Opportunities Found</span>
//               </div>
//               <div className={styles.stat}>
//                 <span className={styles.statValue}>{state.country}</span>
//                 <span className={styles.statLabel}>Your Location</span>
//               </div>
//               <div className={styles.stat}>
//                 <span className={styles.statValue}>{state.path?.replace(/_/g, ' ')}</span>
//                 <span className={styles.statLabel}>Your Path</span>
//               </div>
//             </div>

//             <div className={styles.list}>
//               {data.recommendations.map((r) => (
//                 <RoleCard 
//                   key={r.id} 
//                   title={r.title} 
//                   score={r.score} 
//                   microlearning={r.microlearning}
//                 >
//                   <WhyBox text={r.why} />
//                 </RoleCard>
//               ))}
//             </div>

//             <div className={styles.actions}>
//               <button 
//                 className={`${styles.btn} ${copied ? styles.btnSuccess : ''}`} 
//                 onClick={copyPlan}
//                 disabled={copied}
//               >
//                 {copied ? (
//                   <>
//                     <svg 
//                       width="20" 
//                       height="20" 
//                       viewBox="0 0 24 24" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                     Copied to Clipboard!
//                   </>
//                 ) : (
//                   <>
//                     <svg 
//                       width="20" 
//                       height="20" 
//                       viewBox="0 0 24 24" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
//                       <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//                     </svg>
//                     Save Action Plan
//                   </>
//                 )}
//               </button>

//               <button 
//                 className={styles.btnSecondary}
//                 onClick={() => router.push('/profile')}
//               >
//                 Update Profile
//               </button>
//             </div>
//           </>
//         )}

//         {data && data.recommendations.length === 0 && (
//           <div className={styles.emptyState}>
//             <div className={styles.emptyIcon}>🔍</div>
//             <h3>No recommendations found</h3>
//             <p>Try updating your profile or selecting a different path</p>
//             <button 
//               className={styles.btn}
//               onClick={() => router.push('/profile')}
//             >
//               Update Profile
//             </button>
//           </div>
//         )}
//       </div>

//       <aside className={styles.side}>
//         {data?.countryRisk && (
//           <div className={styles.sideCard}>
//             <h2 className={styles.sideHeading}>Climate Risk Overview</h2>
//             <p className={styles.sideDesc}>
//               Environmental risks for {state.country}
//             </p>
//             <RiskBars
//               flood={data.countryRisk.flood}
//               cyclone={data.countryRisk.cyclone}
//               heat={data.countryRisk.heat}
//               source={data.countryRisk.source}
//             />
//           </div>
//         )}
//       </aside>
//     </section>
//   );
// }