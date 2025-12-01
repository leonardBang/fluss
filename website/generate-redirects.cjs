/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { loadVersionData } from './src/utils/versionData';

const fs = require('fs');
const path = require('path');

const { latestVersion } = loadVersionData();

const redirects = [];

console.log('DEBUG: latestVersion =', latestVersion);

if (latestVersion && latestVersion !== 'current') {
    const docsDir = path.join(__dirname, 'versioned_docs', `version-${latestVersion}`);
    console.log('DEBUG: docsDir =', docsDir);

    if (fs.existsSync(docsDir)) {
        function walk(dir) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    walk(fullPath);
                } else if ((file.endsWith('.md') || file.endsWith('.mdx'))&& !file.endsWith("index.md")) {
                    const relPath = path.relative(docsDir, fullPath).replace(/\.(md|mdx)$/, '');
                    console.log('DEBUG: relPath =', docsDir);
                    redirects.push({
                        from: `/docs/${latestVersion}/${relPath}`,
                        to: `/docs/${relPath}`,
                    });
                }
            }
        }
        walk(docsDir);
    }
}

module.exports = redirects;
console.log('Generated redirects:', redirects);