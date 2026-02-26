# /public/media — All Site Media

Drop converted files here. The code reads directly from these folders.
No code changes needed — just match the exact filename.

---

## /media/images — All images as .webp

| File | Used In |
|---|---|
| `hero-main.webp` | Hero section background |
| `logo.webp` | Hero section logo overlay |
| `navbarlogo.webp` | Navbar, login/register/reset pages, portal, staff |
| `fangapplogo.webp` | Favicon, portal listing page, report page |
| `midsection.webp` | Technology section center image |
| `mediatoday.webp` | Six Channels — MediaToday card |
| `rednote1.webp` | Six Channels — REDNote card |
| `fangmobile.webp` | Six Channels — Fang Portal card + hero side panel |
| `wechat_officialaccount.webp` | Six Channels — WeChat card + hero side panel |
| `wechat_newsletter.webp` | Six Channels — WeChat Newsletter card |
| `sydneytoday.webp` | Six Channels — Sydney Today card |
| `redbook.webp` | Philosophy section, report page channel icons |
| `wechat.webp` | Philosophy section, portal/report page channel icons |
| `casestudy1.webp` | Case Study gallery card 1 |
| `casestudy2.webp` | Case Study gallery card 2 |
| `casestudy3.webp` | Case Study gallery card 3 |
| `casestudy4.webp` | Case Study gallery card 4 |
| `casestudy5.webp` | Case Study gallery card 5 |
| `casestudy6.webp` | Case Study gallery card 6 |
| `casestudy7.webp` | Case Study gallery card 7 |
| `casestudy8.webp` | Case Study gallery card 8 |
| `e1.webp` | Essential package filmstrip 1 |
| `e2.webp` | Essential package filmstrip 2 |
| `e3.webp` | Essential package filmstrip 3 |
| `e4.webp` | Essential package filmstrip 4 |
| `e5.webp` | Essential package filmstrip 5 |
| `p1.webp` | Premium package filmstrip 1 |
| `p2.webp` | Premium package filmstrip 2 |
| `p3.webp` | Premium package filmstrip 3 |
| `p4.webp` | Premium package filmstrip 4 |
| `p5.webp` | Premium package filmstrip 5 |
| `t1.webp` | Premium+ package filmstrip 1 |
| `t2.webp` | Premium+ package filmstrip 2 |
| `t3.webp` | Premium+ package filmstrip 3 |
| `t4.webp` | Premium+ package filmstrip 4 |
| `t5.webp` | Premium+ package filmstrip 5 |

---

## /media/videos — All videos as .webm

| File | Used In |
|---|---|
| `fangvid.webm` | Philosophy section background video |
| `fangexplainer.webm` | Testimonials/about section full-width video |
| `left.webm` | Technology section — left side panel (desktop) |
| `right.webm` | Technology section — right side panel (desktop) |
| `essential.webm` | Packages — Essential "See Demo" modal |
| `premium.webm` | Packages — Premium "See Demo" modal |
| `premiumplus.webm` | Packages — Premium+ "See Demo" modal |

---

## Conversion tips

**Images (jpg/png → webp):**
- Use [Squoosh](https://squoosh.app) or `cwebp` CLI
- Recommended quality: 80–85
- Keep exact same filename, just change extension to `.webp`

**Videos (mp4 → webm):**
- Use HandBrake or ffmpeg: `ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 output.webm`
- Target under 50MB per file for Vercel deployment
- Keep exact same filename, just change extension to `.webm`
