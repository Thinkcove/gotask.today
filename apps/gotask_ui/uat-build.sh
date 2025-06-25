# docker build -t test-build .
 
# Remove the previous build and create new build
rm -rf .next
 
# Create new build
npm run lint
npm run format
npm run build:uat
cp -r public .next/standalone/
cp .env .next/standalone
cp -r .next/static .next/standalone/.next/