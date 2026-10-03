import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import { games } from "@/content/games";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Outside work — Games | Aiden Rhaa",
  description: "Doodle Rumble, Cat Racers, Lumen, Resonance, Lunchbox, and Belly Float: games from Aiden Rhaa’s spare time.",
  alternates: { canonical: absoluteUrl("/games") },
};

export default function GamesPage() {
  return <SiteFrame><div className="games-page">
    <section className="games-hero" aria-labelledby="games-title">
      <nav className="games-breadcrumb" aria-label="Breadcrumb"><a href="/#profile">Back to profile</a><span aria-hidden="true">/</span><span aria-current="page">Outside work</span></nav>
      <div className="games-title-row"><p className="eyebrow">A small family workshop</p><h1 id="games-title">Games from our spare time.</h1><div className="games-intro"><p>I enjoy creating games with my children. Here are some of the projects we’ve been bringing to life.</p><p>Drawings, cats, lanterns, music, one very full lunchbox, and a little otter adventure.</p></div></div>
      <nav className="games-jump" aria-label="Games">{games.map(game=><a key={game.id} href={`#${game.id}`}>{game.title}</a>)}</nav>
    </section>
    {games.map((game,index)=><section key={game.id} id={game.id} className="game-entry" aria-labelledby={`${game.id}-title`}>
      <div className="game-copy"><p className="eyebrow">0{index+1} / {game.category}</p><h2 id={`${game.id}-title`}>{game.title}</h2><p className="game-description">{game.description}</p><p className="game-detail">{game.detail}</p><p className="game-status">{game.status}</p>
      {(game.project || game.play) && <div className="game-links">{game.play && <a href={game.play} target="_blank" rel="noreferrer">Play in browser</a>}{game.project && <a href={game.project} target="_blank" rel="noreferrer">View project</a>}{game.release && <a href={game.release} target="_blank" rel="noreferrer">Mac release</a>}</div>}</div>
      <figure className="game-figure"><a href={game.original} target="_blank" rel="noreferrer" className="game-image-link" aria-label={`View the full-size ${game.title} image in a new tab`}><img src={game.image} width={game.width} height={game.height} alt={game.alt} loading="lazy" decoding="async" /></a><figcaption><span>{game.caption}</span><a href={game.original} target="_blank" rel="noreferrer">View full size</a></figcaption></figure>
    </section>)}
    <section className="gallery-close"><p>Lumen, Resonance, and Lunchbox are still in development and are shared here through images rather than public downloads.</p><a className="text-link" href="/#work">Back to the cloud systems</a></section>
  </div></SiteFrame>;
}
