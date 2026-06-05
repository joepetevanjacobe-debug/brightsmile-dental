# Deploying BrightSmile Live (Free)

Your app has 3 parts. Here's where each one will live:

| Part | Host | Cost |
|------|------|------|
| MySQL database | Aiven | Free forever |
| Spring Boot API | Render (Docker) | Free |
| React frontend | Render (Static Site) | Free |

Total time: ~30–40 minutes. No credit card required.

---

## STEP 1 — Create the free MySQL database (Aiven)

1. Go to **https://aiven.io** → **Sign up** (use your Google account, no card needed).
2. After login, click **Create service** → choose **MySQL**.
3. Select the **Free** plan, pick a cloud/region close to you, name it `brightsmile-db`, click **Create**.
4. Wait ~2–3 minutes until status turns **Running**.
5. Open the service and find the **Connection information**. Note these:
   - **Host** (e.g. `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g. `12345`)
   - **User** (usually `avnadmin`)
   - **Password** (click the eye icon to reveal)
   - **Database name** (usually `defaultdb`)

You'll paste these into Render in Step 3. Your JDBC URL will look like:

```
jdbc:mysql://HOST:PORT/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

---

## STEP 2 — Deploy both services on Render (Blueprint)

1. Go to **https://render.com** → **Sign up with GitHub** (authorize it).
2. Click **New +** → **Blueprint**.
3. Select your repo **`brightsmile-dental`** → **Connect**.
4. Render reads `render.yaml` and shows 2 services: `brightsmile-api` and `brightsmile-web`.
5. It will prompt you for the env vars marked "sync: false". Fill in the API ones now
   (leave `VITE_API_URL` and `APP_FRONTEND_URL` blank for now — we set those after the URLs exist):

   | Variable | Value |
   |----------|-------|
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://HOST:PORT/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
   | `SPRING_DATASOURCE_USERNAME` | `avnadmin` (your Aiven user) |
   | `SPRING_DATASOURCE_PASSWORD` | your Aiven password |

6. Click **Apply / Create**. The backend will build (Docker — takes ~5–8 min the first time).

---

## STEP 3 — Connect the two services together

Once both services finish their first deploy, each gets a URL like
`https://brightsmile-api.onrender.com` and `https://brightsmile-web.onrender.com`.

1. **Tell the frontend where the API is:**
   - Open the **brightsmile-web** service → **Environment**.
   - Set `VITE_API_URL` = your **API** URL (e.g. `https://brightsmile-api.onrender.com`).
   - Click **Save** → it redeploys automatically.

2. **Tell the backend which frontend to trust (CORS):**
   - Open the **brightsmile-api** service → **Environment**.
   - Set `APP_FRONTEND_URL` = your **frontend** URL (e.g. `https://brightsmile-web.onrender.com`).
   - Click **Save** → it redeploys.

---

## STEP 4 — Visit your live site! 🎉

Open your **brightsmile-web** URL. Test it:
- Home page + Services should load (data comes from the live DB).
- Admin login: `admin@brightsmile.com` / `Admin@1234` → **change this password immediately**.

---

## Good to know

- **First load is slow (~50s):** Render's free backend "sleeps" after 15 min of no traffic
  and takes ~50s to wake up on the next request. Paid ($7/mo) removes this.
- **Aiven free DB also sleeps** after long inactivity — one click in the dashboard wakes it.
- **Email features** (booking confirmations) stay off until you add real SMTP credentials
  as env vars on the backend (`SPRING_MAIL_HOST`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`).
- **Staying logged in:** because the frontend and API are on different domains, the 15-minute
  session won't auto-refresh. You may need to log in again after 15 min. (Fixable later with a
  custom domain or an nginx proxy — ask if you want this.)
- **Every future `git push`** to `main` auto-redeploys both services. No extra steps.
</content>
