# ANISH BHATTARAI — PUBLIC PROFILE (source for the "Ask Anish" AI guide)

Edit this file to change what the AI knows. Only public information belongs here.

## Who is Anish? (short answer)
Anish Bhattarai is a Ph.D. student and Graduate Research Assistant in Crop and Soil Sciences at the University of Georgia (UGA) in Athens, Georgia, USA. He is a precision agriculture researcher: he combines agronomy, crop sensors, drones (UAV LiDAR and imagery), satellite and weather data, spatial modeling, and software to turn complex field data into practical decisions for farmers, Extension agents, and researchers. He grew up academically in Nepal (B.Sc. in Agriculture, Chitwan) and moved to UGA in 2022. He has 7 journal articles listed on Google Scholar (39 citations, h-index 4 as of November 2026; see "Citation metrics" for the latest numbers), 15 awards and honors, a 3.92/4.00 doctoral GPA, and has built several open research tools (GeoSampler, Plant Pixel Extractor, FieldRank, Cotton × ENSO Explorer). His site's tagline: "I turn field data into decisions that travel."

## Contact and links
- Email: ab68010@uga.edu (best way to reach him for collaboration, speaking, or questions)
- Website: https://leoanish.github.io/Anish-Website/
- Full CV (PDF): https://leoanish.github.io/Anish-Website/assets/Anish_Bhattarai_CV_2026.pdf
- Google Scholar: https://scholar.google.com/citations?user=NixJyg0AAAAJ
- GitHub: https://github.com/Leoanish
- LinkedIn: https://www.linkedin.com/in/anish-bhattarai-b158761b3
- Location: Athens, Georgia, USA.

## Academic journey
- 2015–2020: B.Sc. in Agriculture, Agriculture and Forestry University, Chitwan, Nepal. This agronomic foundation anchors his later sensor, modeling, and software work. Received an undergraduate scholarship (listed on his CV as "Full Bright Scholarship", 2015) and a 2020 startup grant for a house-plant nursery in Nepal.
- 2022: Joined the University of Georgia as a Graduate Research Assistant on the M.S. track in Crop and Soil Sciences.
- 2024: Graduate Certificate in Agricultural Data Science, UGA.
- Summer 2025: Transitioned directly from the M.S. track into the Ph.D. program.
- 2025–2027: Ph.D. in Crop and Soil Sciences, UGA. Expected completion 2027. GPA 3.92/4.00.

## Current role
Graduate Research Assistant, University of Georgia, 2022–present. He designs and analyzes field experiments in cotton and precision nutrient management; integrates crop sensors, UAV and satellite imagery, LiDAR point clouds, weather data, and geospatial modeling; and develops reproducible workflows and interactive tools for research and Extension audiences.

## Research overview
Overall goal: improve decision-making in precision agriculture by combining sensor-based nitrogen (N) management, high-resolution environmental data, and user-friendly tools — to reduce input waste, improve environmental sustainability, and support site-specific decisions under a changing climate and limited resources.

Three guiding questions:
1. How can field data improve crop decisions? Sensor-based nitrogen management that weighs yield, fiber quality, nitrogen-use efficiency, and profitability.
2. When does weather data represent a field? Comparing station and gridded products and testing the influence of distance, topography, soil, land cover, and other conditions.
3. How do we make complex evidence usable? Reproducible workflows and interactive tools for farmers, Extension agents, researchers, and other decision-makers.

Master's-track research (2022–2025) — sensor-based variable-rate nitrogen in cotton:
- Question: how consistently can crop sensors guide in-season nitrogen decisions across changing cotton field environments?
- Compared active and passive crop sensors, sensor-based N recommendations, and traditional N management across multiple field environments.
- Evaluated sensor accuracy, consistency, and practical usefulness, alongside yield, fiber quality, nitrogen use efficiency (NUE), and profitability.
- Why it matters: good variable-rate recommendations cut input waste while maintaining crop performance and farm economics.

Doctoral research (2025–present) — "Assessing Spatial Representativeness of Weather Data: Station vs. Gridded Products for Precision Agriculture":
- Problem: weather data drives irrigation scheduling, pest management, and nutrient recommendations, but users rely on either point-based station data or gridded products (PRISM, Daymet) without knowing their strengths and limits at field scale.
- Approach: compares the high-density University of Georgia Weather Network with PRISM and Daymet for variables such as temperature and precipitation, using geostatistics, machine learning, and spatial analysis. Tests how distance from a station, topography, soil type, land cover, and other conditions affect agreement.
- Also studies how weather-data uncertainty carries into downstream decisions, especially sensor-based nitrogen management and crop performance.
- Status: active research; results not yet published.

## Research and software projects
1. Weather data representativeness (2025–present) — doctoral research described above.
2. Sensor-based variable-rate nitrogen management in cotton (2022–2025) — field research described above.
3. UAV LiDAR acquisition and processing for cotton (2024–2025) — tested flight altitude, flight speed, point-cloud subsampling, and terrain-classification settings to give efficient canopy-height data-collection guidance. Workflow: acquire UAV LiDAR → classify terrain → derive canopy height → compare settings → practical guidance. Result: first-author paper in Remote Sensing (2025). R workflow code: https://github.com/Leoanish/Lidar-Processing
4. GeoSampler (2025–present) — an interactive R Shiny dashboard that turns free satellite data into statistically defensible field sampling plans. Users draw or upload a field boundary; the app retrieves Sentinel-2 imagery and elevation data, computes vegetation indices (NDVI, NDRE, GNDVI, EVI, SAVI) and terrain derivatives (slope, aspect, TWI, TPI), compares sampling techniques, and generates GPS sample points using methods such as conditioned Latin Hypercube Sampling (cLHS), zone-based, hybrid, simple random, and systematic designs. It can compare against prior sampling points, estimate cost savings, and export a PDF field plan and GeoJSON. No GIS software, coding, or data subscription needed. Won first place in the Precision Agriculture Systems Ph.D. oral competition at CANVAS 2026 (Portland, Oregon). Live app: https://recuga.shinyapps.io/geosampler/ · Code: https://github.com/Leoanish/geosampler
5. Plant Pixel Extractor (PPE) (2026–present) — a package and QGIS plugin, authored by Anish, that separates plant pixels from soil in drone orthomosaics with no training data. Works with RGB, multispectral (MicaSense, Parrot Sequoia, DJI, and others), and hyperspectral images. How it works: it ranks the vegetation indices an image allows by how well they separate plant from soil, splits the best three with four automatic thresholds (Otsu, CDF knee, k-means, multi-Otsu), and lets the twelve results vote; guards then remove shadows, algae on wet soil, and grey objects. With a plot boundary file it exports canopy cover per plot and plant-pixel statistics for every band and index. Purpose: reproducible image-based phenotyping. Code: https://github.com/Leoanish/ppe-qgis
6. FieldRank (on Anish's GitHub) — a free web app that compares a corn, cotton, peanut, or soybean field in Georgia with nearby fields of the same crop planted at about the same time, using Sentinel-2 and Landsat satellite images, to answer "Should I scout my field?". It ranks the field with a sufficiency index (the field's value divided by a reference from comparable fields) and explains the evidence. Live app: https://fieldrank.streamlit.app · Code: https://github.com/Leoanish/fieldrank
7. Cotton × ENSO Explorer (on Anish's GitHub) — an interactive dashboard linking 75 years of El Niño / La Niña (ENSO) events to subnational cotton yields in the United States, Brazil, India, and Argentina, with each place measured against its own long-term yield trend. Includes maps, trends, event timelines, comparisons, and an "Ask the data" chat. Live: https://leoanish.github.io/cotton-enso-explorer/ · Code: https://github.com/Leoanish/cotton-enso-explorer
8. Root Cause (2026) — a multi-regional corn nitrogen recommender for the U.S. Midwest, built for the CANVAS 2026 Precision Agriculture Hackathon by Team 3: Anish Bhattarai (UGA), Murilo Rampazzo Favoretto (UNL), and Prakash Chapagain (NDSU). A farmer drops a pin on a field; open soil (USDA SSURGO), elevation, and weather (NASA POWER) data are pulled automatically; a random-forest model trained on public corn nitrogen trials (49 site-years, 8 Midwest states) gives the most profitable N rate and whether to split the application. Won second place in the CANVAS 2026 Student Hackathon (Portland, Oregon). Code: https://github.com/Leoanish/CANVAS_2026
9. NxS Advisor (2026) — a decision tool built with Team Georgia at the NxS Hackathon from a multi-state nitrogen-by-sulfur dataset; won second place.

Where to try things: the website's "Tools & dashboards" section links every live app and repository. Live apps: GeoSampler, FieldRank, Cotton × ENSO Explorer. Installable: Plant Pixel Extractor QGIS plugin (version 3.8, needs QGIS 3.28 or newer; install from the GitHub repository's releases or ZIP). Code only: Root Cause, LiDAR Processing. All public repositories: https://github.com/Leoanish?tab=repositories

## Peer-reviewed publications
Six papers are summarised in detail below. Google Scholar also lists a 2022 article in the Nepalese Journal of Agricultural Sciences: "Disease diversity and disorder in cauliflower and their management practices adopted by farmers in Dhunibeshi municipality, Dhading" (co-author; no summary available here, so point to Google Scholar for it). The "Citation metrics" section has current citation counts for every paper.
Publications at a glance (newest first). Every paper below has a summary of results, a link, and a citation. When asked about a paper, never say its results are unavailable. Answer with a one-line summary, then 3 to 5 short bullets of results in plain words, then "Explore more:" with the DOI link, then "Cite this paper:" with the citation exactly as written. Use only the facts and numbers written in that paper's summary: do not add other methods, model names, values, or comparisons, and never estimate numbers. If someone asks for a detail that is not in the summary, say it is in the full paper and give the link. Do not use tables; use short bullets.
- 2026 · CottonVaRx variety recommender dashboard · European Journal of Agronomy · co-author · https://doi.org/10.1016/j.eja.2026.128090
- 2026 · Peanut yield and grade prediction with explainable AI · Computers and Electronics in Agriculture · co-author · https://doi.org/10.1016/j.compag.2025.111270
- 2025 · Optimizing UAV LiDAR data collection in cotton · Remote Sensing · FIRST AUTHOR · https://doi.org/10.3390/rs17091504
- 2025 · Cotton lint yield and quality variability in Georgia · Field Crops Research · second author · https://doi.org/10.1016/j.fcr.2025.109822
- 2021 · Tuber size and nutrient source for yam · Acta Scientifica Malaysia · co-author · https://doi.org/10.26480/asm.01.2021.17.19
- 2021 · Crop establishment methods for spring rice · Big Data in Agriculture · co-author · https://doi.org/10.26480/bda.01.2021.06.11
Frequent co-authors: Leonardo M. Bastos, Gonzalo J. Scarpin, Lavesta C. Hand, John L. Snider, Phillip M. Roberts, Wesley Porter, Amrinder Jakhar (University of Georgia).

1. CottonVaRx dashboard paper (2026, European Journal of Agronomy). Anish is a co-author.
   - What: an interactive dashboard that recommends cotton varieties, built from the UGA On-Farm Cotton Variety Evaluation Program: 117 trials at 35 sites over five years (2020–2024), irrigated and dryland.
   - Results: it lets growers and agents compare how varieties perform across different environments and pick the ones suited to their own conditions, turning years of trial data into a practical variety-selection tool.
   - Explore more: https://doi.org/10.1016/j.eja.2026.128090
   - Cite this paper: Scarpin, G. J., Hand, L. C., Roberts, P. M., Bhattarai, A., & Bastos, L. M. (2026). CottonVaRx: A cotton variety recommender dashboard use case from Georgia, USA. European Journal of Agronomy, 177, 128090. https://doi.org/10.1016/j.eja.2026.128090
2. Peanut yield and grade prediction paper (2026, Computers and Electronics in Agriculture). Anish is a co-author.
   - What: predicted peanut yield and grade (quality) across Georgia from management, soil, weather, and remote-sensing data. Compared 18 machine-learning models, tested them on site-years they had never seen, and used SHAP (an explainable-AI method) to show which factors drove each prediction.
   - Results: management plus soil data predicted yield best (typical error about 816 kg/ha); management plus remote-sensing data predicted grade best (error about 1.5 percentage points). Irrigation was by far the strongest driver of yield, followed by field location, clay content in the 15–30 cm soil layer, and season length.
   - Takeaway: combining farm records with free environmental and satellite data gives useful early estimates of peanut yield and quality, and explainable AI shows growers why.
   - Explore more: https://doi.org/10.1016/j.compag.2025.111270
   - Cite this paper: Scarpin, G. J., Studstill, S. B., Monfort, W. S., Tubbs, R. S., Pilon, C., Jakhar, A., Bhattarai, A., Dhaliwal, A. K., & Bastos, L. M. (2026). Peanut yield and grade prediction in Georgia, USA: Integrating management, climate, and remote sensing data with explainable AI. Computers and Electronics in Agriculture, 241, 111270. https://doi.org/10.1016/j.compag.2025.111270
3. UAV LiDAR in cotton paper (2025, Remote Sensing). Anish is the FIRST AUTHOR; this is his lead paper. Open access.
   - What: tested nine drone flight settings (altitudes 12.2, 24.4, and 48.8 m × speeds 4.8, 9.6, and 14.4 km/h) and two processing choices in DJI Terra (point-cloud thinning from 0 to 50 cm, and flat/gentle/steep slope classification), judged on canopy-height accuracy, processing time, and file size.
   - Results: 24.4 m was the best altitude; flight speed did not affect accuracy; thinning the point cloud up to 20 cm kept accuracy while cutting processing time and file size; slope classification made no significant difference.
   - Takeaway: you can fly faster and thin the data without losing canopy-height accuracy, which makes LiDAR monitoring of cotton (for example for growth-regulator decisions) cheaper. A step toward standard LiDAR guidelines for cotton.
   - Explore more: https://doi.org/10.3390/rs17091504
   - Cite this paper: Bhattarai, A., Scarpin, G. J., Jakhar, A., Porter, W., Hand, L. C., Snider, J. L., & Bastos, L. M. (2025). Optimizing unmanned aerial vehicle LiDAR data collection in cotton through flight settings and data processing. Remote Sensing, 17(9), 1504. https://doi.org/10.3390/rs17091504
4. Cotton lint yield and quality paper (2025, Field Crops Research). Anish is the second author.
   - What: analysed 73 site-years of Georgia variety trials to separate the effects of environment, variety (genotype), and management on lint yield and fiber quality, and to identify which weather conditions favour high yield and quality.
   - Results: environment influenced yield and fiber quality (length, strength, uniformity, micronaire) more than variety did. The study produced variety recommendations for each type of environment. Temperature and the length of the squaring and boll-opening stages were the most important factors for micronaire, yellowness, length, and uniformity.
   - Takeaway: picking the right variety depends on the environment it will grow in; the authors proposed an online variety-selection tool as the next step.
   - Explore more: https://doi.org/10.1016/j.fcr.2025.109822
   - Cite this paper: Scarpin, G. J., Bhattarai, A., Hand, L. C., Snider, J. L., Roberts, P. M., & Bastos, L. M. (2025). Cotton lint yield and quality variability in Georgia, USA: Understanding genotypic and environmental interactions. Field Crops Research, 325, 109822. https://doi.org/10.1016/j.fcr.2025.109822
5. Yam paper (2021, Acta Scientifica Malaysia). Anish is a co-author; undergraduate research in Nepal.
   - What: a field experiment at Kalyanpur, Chitwan (2018/2019) comparing small (under 50 g) and large (100–150 g) seed tubers with three nutrient sources: farmyard manure, chicken manure, and forest soil.
   - Results: large seed tubers gave significantly higher yield (about 3.05 kg versus less with small tubers), and tuber size and nutrient source interacted significantly.
   - Takeaway: plant large (100–150 g) tubers with farmyard manure to raise yam yield.
   - Explore more: https://doi.org/10.26480/asm.01.2021.17.19
   - Cite this paper: Adhikari, G., Bista, D., Bhattarai, A., & Paudel, H. (2021). Effect of tuber size and nutrient source on the yield of yam (Dioscorea sp.). Acta Scientifica Malaysia, 5(1), 17–19. https://doi.org/10.26480/asm.01.2021.17.19
6. Spring rice paper (2021, Big Data in Agriculture). Anish is a co-author; undergraduate research in Nepal.
   - What: compared four ways of establishing spring rice (variety Hardinath-1) at Khairahani, Chitwan in 2020: mechanical transplanting, wet direct seeding, dry direct seeding, and manual transplanting, measuring growth, yield, and profit.
   - Results: mechanical transplanting was best, with the highest grain yield (6.46 t/ha), straw yield (11.98 t/ha), gross returns (NRs 155,620 per ha), and net returns (NRs 81,280 per ha), and a benefit-cost ratio of 2.1. Manual transplanting came second. Wet direct seeding yielded 3.40 t/ha. Dry direct seeding did worst: 2.36 t/ha of grain and a net loss (benefit-cost ratio 0.84). The average across all four methods was 4.33 t/ha.
   - Takeaway: mechanical transplanting was the most productive and most profitable way to establish spring rice there; dry direct seeding was not profitable.
   - Explore more: https://doi.org/10.26480/bda.01.2021.06.11
   - Cite this paper: Poudel, K., Timilsina, R. H., & Bhattarai, A. (2021). Effect of crop establishment methods on yield of spring rice at Khairahani, Chitwan, Nepal. Big Data in Agriculture, 3(1), 6–11. https://doi.org/10.26480/bda.01.2021.06.11

<!-- scholar:start -->
## Citation metrics (from Google Scholar, updated 2026-11-18)
- Total citations: 39 (since 2021: 39); h-index 4; i10-index 1.
- On the profile: 7 journal articles, 15 conference presentations, 26 items in total. Google Scholar profile: https://scholar.google.com/citations?user=NixJyg0AAAAJ&hl=en
- Citations per publication:
  - [presentation] Comparative Evaluation of Kriging Models and Variogram Structures for Daily Climate Interpolation across Georgia, United States (2010–2024) (CANVAS 2026, 2026, 2026): cited 0 times
  - [journal] CottonVaRx: A cotton variety recommender dashboard use case from Georgia, USA (European Journal of Agronomy 177, 128090, 2026, 2026): cited 1 times
  - [presentation] Geosampler: A Comprehensive Geospatial Data Acquisition and Sampling Dashboard (CANVAS 2026, 2026, 2026): cited 0 times
  - [journal] Peanut yield and grade prediction in Georgia, USA: Integrating management, climate, and remote sensing data with explainable AI (Computers and Electronics in Agriculture 241, 111270, 2026, 2026): cited 4 times
  - [presentation] Assessing Sensor-Based Variable Rate Nitrogen Recommendation from Proximal, Drone, and Satellite Platforms Under Variable Pre-Plant Nitrogen Strategies in Corn (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] Blending Agronomy with Technology: Data-Driven Decision for Nitrogen Management in Cotton (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] Comparative Analysis of in-Season Nitrogen Rate Recommendation from Proximal and Remote Sensors (CANVAS 2025, 2025, 2025): cited 0 times
  - [journal] Cotton lint yield and quality variability in Georgia, USA: Understanding genotypic and environmental interactions (Field Crops Research 325, 109822, 2025, 2025): cited 19 times
  - [presentation] Cotton Quality Response to Variable Rate and Fixed Nitrogen Application Strategies (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] Evaluating N2O Emissions from Biochar and Poultry Litter-Amended Corn-Soybean Fields (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] From Soil to Staple: Predicting Cotton Fiber Quality in Grower Fields Using Machine Learning (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] Identifying Environmental Yield Potential and Variety Responsiveness in the US Cotton Belt Using Four Decades of Multi-Location Data and Machine Learning (CANVAS 2025, 2025, 2025): cited 0 times
  - [other] Optimizing UAV LiDAR Data Collection in Cotton Through Flight Settings and Data Processing Best Practices (Preprints, 2025, 2025): cited 0 times
  - [journal] Optimizing unmanned aerial vehicle LiDAR data collection in cotton through flight settings and data processing (Remote Sensing 17 (9), 1504, 2025, 2025): cited 5 times
  - [presentation] Predicting Yield Stability Classes Using Satellite Imagery (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] Sensor-Based Side Dress Nitrogen Management Enhances Yield, Efficiency, and Profitability in Corn Under Varying Pre-Plant Strategies (CANVAS 2025, 2025, 2025): cited 0 times
  - [presentation] Comparing Proximal and Remote Sensing Approaches to Nitrogen Management in Cotton (ASA, CSSA, SSSA International Annual Meeting, 2024, 2024): cited 0 times
  - [presentation] Sensor-Based Nitrogen Management in Cotton Maintains Yield and Improves Profit and Use Efficiency (ASA, CSSA, SSSA International Annual Meeting, 2024, 2024): cited 0 times
  - [presentation] Enhancing Nitrogen Management for High-Yielding Corn: Updated Recommendations and Sensor Technology Assessment (ASA, CSSA, SSSA International Annual Meeting, 2023, 2023): cited 0 times
  - [presentation] Side-Dress Nitrogen Rate and Sensor-Based Variable Management in Cotton (ASA, CSSA, SSSA International Annual Meeting, 2023, 2023): cited 0 times
  - [journal] Disease diversity and disorder in cauliflower and their management practices adopted by farmers in Dhunibeshi municipality, Dhading (NEPALESE JOURNAL OF AGRICULTURAL SCIENCES 39, 2022, 2022): cited 1 times
  - [other] Vegetable farming and its impact on economic aspect of farmers' livelihood in Namobuddha Municipality, Kavrepalanchok. (no venue listed, 2022): cited 0 times
  - [journal] Effect of tuber size and nutrient source on the yield of yam (Dioscorea sp.) (Acta Scientifica Malaysia 5 (1), 17-19, 2021, 2021): cited 4 times
  - [journal] Effect of crop establishment methods on yield of spring rice at Khairahani, Chitwan, Nepal (Big Data In Agriculture 3 (1), 06-11, 2020, 2020): cited 5 times
  - [other] Optimizing Corn Yield, Nutrient Use Efficiency and Partial Profit through Side-Dress Nitrogen Timing, and Sensor-Based Variable Nitrogen Management (no venue listed, n.d.): cited 0 times
  - [other] UNIVERSITY OF GEORGIA COTTON VARIETY RECOMMENDER DASHBOARD (Available at SSRN 5551134, 0, n.d.): cited 0 times
<!-- scholar:end -->

## Awards and honors (15)
- 2026 — Precision Agriculture Systems Ph.D. Oral Competition, First Place. CANVAS 2026 conference, Portland, Oregon. Anish presented "GeoSampler: A Comprehensive Geospatial Data Acquisition and Sample Recommending Dashboard", which helps users gather geospatial data and decide where to collect samples within a field.
- 2026 — CANVAS Student Hackathon, Second Place. CANVAS 2026 conference, Portland, Oregon. His team built a dashboard giving nitrogen fertilizer rate recommendations for Midwest growers (the Root Cause project).
- 2026 — NxS Hackathon, Second Place, Team Georgia. Nitrogen Use Efficiency Workshop, Mississippi State University, Starkville, MS (built NxS Advisor).
- 2026 — Eterna Fund Scholarship. UGA College of Agricultural and Environmental Sciences (CAES) Alumni Association.
- 2025 — Graduate Student Oral Competition, First Place, Precision Agriculture Systems. ASA, CSSA, and SSSA Annual Meeting, Salt Lake City, UT.
- 2025 — Graduate Student Hackathon, First Place, Team DataGenix. Bayer Data Intelligence and Code Competition, ASA-CSSA-SSSA Annual Meeting, Salt Lake City, UT.
- 2025 — Graduate Student Poster Competition, Second Place. Institute of Integrative Precision Agriculture Conference, Perry, GA.
- 2025 — Outstanding Graduate Student Scholar. UGA CAES Alumni Association.
- 2024 — Graduate Student Poster Competition, First Place, Sensor-Based Nutrient Management. American Society of Agronomy, San Antonio, TX.
- 2024 — Graduate Student Oral Competition, First Place, Precision Agriculture Systems. American Society of Agronomy, San Antonio, TX.
- 2024 — Poster Presentation, Second Place. International Conference on Precision Agriculture, Manhattan, KS.
- 2024 — E. Broadus Browne Research Award, First Place. UGA CAES.
- 2023 — Graduate Student Poster Competition, Third Place. ASA, CSSA, and SSSA Annual Meeting, St. Louis, MO.
- 2023 — Graduate Student Hackathon, Second Place. ASA, CSSA, and SSSA Annual Meeting, St. Louis, MO.
- 2023 — Student Hackathon, First Place, Crop Track. Institute of Integrative Precision Agriculture, Athens, GA.
Summary: 7 first-place finishes, 5 second places, 1 third place, plus the Outstanding Graduate Student Scholar honor and the Eterna Fund Scholarship. (ASA = American Society of Agronomy; CSSA = Crop Science Society of America; SSSA = Soil Science Society of America.)

## Funding
- Graduate Research Assistantship, University of Georgia, 2022–present.
- Startup Grant, House Plant Nursery, Nepal, 2020.
- Undergraduate scholarship, 2015 (see Academic journey).

## Extension and outreach
- 2024 — Farmers Field Day, presenter on in-season nitrogen management, Watkinsville, GA.
- 2024 — Precision Agriculture Tour, invited speaker, Watkinsville, GA.
- 2024 — Precision Agriculture tabling event for high-school students, Athens, GA.
- 2023 — Cotton Production Field Day, participant, Midville, GA.
- 2023 — Farmers Field Day, participant, Watkinsville, GA.

## Leadership and community
- Secretary, Integrative Precision Agriculture Club, UGA, 2024–2026.
- President, Nepalese Student Association, UGA, 2024–2025.

## Skills
- Programming and analytics: R, Shiny, statistical modeling, machine learning, reproducible workflows, data visualization. His GitHub tools also use Python (QGIS plugin, Streamlit) and JavaScript dashboards.
- Geospatial and remote sensing: GIS (including QGIS), spatial analysis, geostatistics, UAV multispectral imagery and LiDAR, point-cloud processing (DJI Terra), satellite data (Sentinel-2, Landsat), weather-data integration (PRISM, Daymet, station networks).
- Agronomic research: field trials, crop sensing, variable-rate technology, nitrogen management, cotton production, research communication and Extension presentations.

## Plain-language glossary (for visitors new to the field)
- Precision agriculture: managing each part of a field according to its own needs, using data instead of one uniform rate.
- Variable-rate nitrogen: applying different fertilizer amounts across a field based on what the crop needs in each spot.
- Crop sensors (active/passive): devices that measure light reflected by plants to estimate crop health; active sensors carry their own light source, passive ones use sunlight.
- NUE (nitrogen use efficiency): how much of the applied nitrogen ends up benefiting the crop.
- UAV: unmanned aerial vehicle (drone). LiDAR: laser scanning that builds a 3-D "point cloud", used here to measure plant height.
- PRISM and Daymet: gridded weather datasets that estimate weather everywhere on a map, in contrast to weather stations that measure at single points.
- Geostatistics: statistics for data that vary across space. Explainable AI: methods that show why a machine-learning model made its prediction.
- Sentinel-2: free European satellite imagery. cLHS: a sampling method that picks points covering the full range of conditions in a field.
- ENSO: El Niño–Southern Oscillation, a Pacific climate cycle that shifts weather worldwide.

## Not published (do not guess)
- Personal interests, hobbies, favorite sports, teams, or players — Anish will add these when he chooses.
- Phone number, home address, age, family, immigration status, salary, and other private details.
- His Ph.D. advisor or committee, citation counts, job-search plans, and unpublished results are not stated in this profile — suggest emailing Anish or checking Google Scholar.
