# Capri Wayne: Portfolio

A static portfolio site for GitHub Pages. It has no build step.

## Layout

| Path | What it is |
|---|---|
| `data/content.js` | **Edit this file.** Name, college, section order, and every piece of work |
| `data/crimson.js` | Backup list of Crimson articles, shown under the live embed |
| `data/articles.js` | Full text of "AI Programs: The Rundown" |
| `files/<section>/` | Images, PDFs, and videos, sorted by section |
| `index.html` | Home: name, college, and work grouped by section |
| `work.html?id=…` | One page per piece: gallery, PDF, video, or article |
| `crimson.html` | Your Crimson writer page, embedded live, plus a list of your articles |

## Adding a piece

1. Put the file in `files/<section>/`. Use `.jpg`, `.webp`, `.png`, `.svg`, `.pdf`, or `.mp4`. Browsers can't show `.psd`, `.mov`, or `.docx` files.
2. Copy an entry in `window.WORK` inside `data/content.js` and change its `id`, `title`, `section`, and file paths.

Keep each file under **100 MB**, because GitHub rejects anything larger. To shrink a video:

```bash
ffmpeg -i input.mov -vf scale=-2:720 -c:v libx264 -crf 26 -c:a aac -b:a 96k -movflags +faststart output.mp4
```

## Preview locally

```bash
python3 -m http.server 8765
```

Open http://localhost:8765.

## Publish to GitHub Pages

For a repo named `USERNAME.github.io`:

```bash
git init && git add . && git commit -m "Portfolio site"
```

```bash
git branch -M main && git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
```

```bash
git push -u origin main
```

Then go to **Settings → Pages** in the repo, choose **Deploy from a branch**, and select `main`, `/ (root)`.

GitHub will print a warning about `files/video/hnmun-rewind-2026.mp4` (81 MB), because it's over 50 MB. The push still goes through. If you'd rather avoid the warning, upload the video to YouTube as unlisted and replace the `video` line for `hnmun-rewind` with `video: { youtube: "https://www.youtube.com/embed/VIDEO_ID" }`, then delete the mp4.
