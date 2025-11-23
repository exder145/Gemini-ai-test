<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zXBPUrJ-cUO14-U5S1bbjIQES44oESrB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages 部署

1. 在仓库 `Settings` -> `Secrets and variables` -> `Actions` 添加 `GEMINI_API_KEY`（供前端构建时写入，注意密钥会出现在前端代码中，请自行权衡风险）。
2. 保持默认分支为 `main`，推送代码后 GitHub Actions 会自动运行 `.github/workflows/deploy.yml`，构建并发布到 GitHub Pages。
3. 工作流里通过环境变量 `VITE_BASE_PATH` 设置为 `Gemini-ai-test`，若仓库名变更，请同步更新该值，或在 `Actions -> Workflow Dispatch` 手动触发并传入新的路径。
4. 首次执行后到仓库 `Settings` -> `Pages` 确认 Source 为 GitHub Actions，完成后即可访问 Pages 站点。
