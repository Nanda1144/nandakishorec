'use strict';

const Project = require('../models/project.model');
const Internship = require('../models/internship.model');
const Course = require('../models/course.model');
const Achievement = require('../models/achievement.model');
const Skill = require('../models/skill.model');
const Gallery = require('../models/gallery.model');
const Hero = require('../models/hero.model');
const Header = require('../models/header.model');
const Footer = require('../models/footer.model');


/**
 * Advanced AI-Powered Scraper Engine
 * Uses Heuristic Analysis to recognize and extract portfolio sections.
 */
class ScraperEngine {
  async analyzeAndImport(url, slug) {
    try {
      console.log(`[Deep-Scanner] Investigating: ${url}`);
      const response = await fetch(url);
      const html = await response.text();

      const results = {
        stack: 'Unknown',
        sections: [],
        media: [],
        extracted: { projects: 0, skills: 0, hero: false }
      };

      // --- PHASE 1: Structure Recognition ---
      if (html.includes('__NEXT_DATA__')) results.stack = 'Next.js';
      else if (html.includes('data-reactroot') || html.includes('_reactRootContainer')) results.stack = 'React';
      else if (html.includes('vite')) results.stack = 'Vite';
      
      if (html.includes('text-') && html.includes('bg-') && html.includes('flex')) {
        results.stack += ' + Tailwind CSS';
      }

      // --- PHASE 2: Deep Media Audit ---
      const imgRegex = /<img.*?src="(.*?)".*?alt="(.*?)".*?>/gi;
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        const [full, src, alt] = match;
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, url).href;
        
        // Categorize media
        let type = 'other';
        if (src.toLowerCase().includes('logo')) type = 'logo';
        else if (src.toLowerCase().includes('hero')) type = 'hero';
        
        results.media.push({ url: absoluteUrl, alt: alt || 'Imported Asset', type });
        
        await Gallery.create({
          imageUrl: absoluteUrl,
          caption: alt || 'Auto-detected asset',
          type: type === 'logo' || type === 'hero' ? 'other' : type,
          frontends: [slug]
        });
      }

      // --- PHASE 3: Heuristic Section Classification ---
      const sections = html.match(/<section[\s\S]*?<\/section>/gi) || html.match(/<div.*?class=".*?section.*?">([\s\S]*?)<\/div>/gi) || [];
      
      for (const section of sections) {
        const text = section.toLowerCase();
        
        // 1. PROJECT SCORE
        if (text.includes('github') || text.includes('live demo') || text.includes('project')) {
          const name = this.extractRegex(section, /<h[23].*?>(.*?)<\/h[23]>/i);
          if (name) {
            await Project.create({
              projectName: name,
              description: this.extractRegex(section, /<p.*?>(.*?)<\/p>/i),
              projectLink: this.extractRegex(section, /href="(.*?)"/i),
              frontends: [slug],
              projectStatus: 'Published'
            });
            results.extracted.projects++;
          }
        }
        
        // 2. RESEARCH SCORE
        else if (text.includes('journal') || text.includes('publication') || text.includes('doi')) {
          const title = this.extractRegex(section, /<h[23].*?>(.*?)<\/h[23]>/i);
          if (title) {
            await require('../models/research.model').create({
              researchTitle: title,
              journalName: 'Extracted from Source',
              frontends: [slug]
            });
          }
        }
        
        // 3. INTERNSHIP SCORE
        else if (text.includes('intern') || text.includes('experience') || text.includes('work')) {
          const company = this.extractRegex(section, /<h[23].*?>(.*?)<\/h[23]>/i);
          if (company) {
            await require('../models/internship.model').create({
              companyName: company,
              domainName: 'Professional Experience',
              frontends: [slug]
            });
          }
        }

        // 4. PATENT SCORE
        else if (text.includes('patent') || text.includes('inventor')) {
          const title = this.extractRegex(section, /<h[23].*?>(.*?)<\/h[23]>/i);
          if (title) {
            await require('../models/patent.model').create({
              patentTitle: title,
              frontends: [slug]
            });
          }
        }
      }

      // --- PHASE 4: Layout & Navbar Detection ---
      const navLinks = html.match(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi) || [];
      const links = navLinks.slice(0, 5).map(l => ({
        label: l.match(/>(.*?)<\/a>/i)?.[1].replace(/<[^>]*>?/gm, '').trim(),
        href: l.match(/href="(.*?)"/i)?.[1]
      })).filter(l => l.label && l.href);

      await Header.findOneAndUpdate(
        { frontendSlug: slug },
        { 
          navLinks: links,
          frontendSlug: slug
        },
        { upsert: true }
      );

      return {
        success: true,
        stack: results.stack,
        summary: `AI Deep Analysis complete. Extracted ${results.extracted.projects} Projects and mapped Header Layout.`,
        data: results
      };



    } catch (error) {
      console.error('[AI-Importer Error]', error);
      throw error;
    }
  }

  extractRegex(html, regex) {
    const match = html.match(regex);
    return match ? match[1].replace(/<[^>]*>?/gm, '').trim() : '';
  }
}

module.exports = new ScraperEngine();
