npx @dytesdk/upgrade-to-rtk .
for dir in samples/*; do (cd "$dir" && npm run build); done
