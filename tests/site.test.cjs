const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const html=read('index.html');
test('courier homepage uses Franks24 brand and canonical domain',()=>{
 assert.match(html,/<title>Franks24/);assert.match(html,/https:\/\/www.franks24.com\//);
 assert.match(html,/Dispatch is a Franks24 service/);assert.equal(read('CNAME').trim(),'www.franks24.com');
 assert.doesNotMatch(html,/job seeker|hiring teams|I'm hiring|find opportunities/i);
});
test('all service and policy links point to canonical courier app',()=>{
 for(const route of ['deliveries/#quote','deliveries/#booking','deliveries/#tracking','driver/','dispatcher/','operations/','legal/delivery-terms.html','legal/delivery-privacy.html','legal/delivery-data.html'])assert.ok(html.includes('https://dispatch.franks24.com/'+route),route);
 for(const match of html.matchAll(/(?:href|src)="\.\/([^"#]+)"/g))assert.ok(fs.existsSync(path.join(__dirname,'..',match[1])),match[1]);
 assert.match(html,/Live quotes, bookings and payments are not open yet/);
});
test('shared responsive theme and keyboard navigation match dispatch',()=>{
 assert.match(html,/assets\/site-shell.css/);assert.match(read('assets/site-shell.js'),/Escape/);
 assert.match(html,/aria-label="Main navigation"/);assert.match(html,/aria-controls="f24-navigation"/);
 assert.match(read('assets/site-shell.css'),/prefers-reduced-motion:reduce/);assert.match(read('assets/site-shell.css'),/#c8202f/);
});
