# ANISH BHATTARAI — PUBLIC PROFILE (source for the "Ask Anish" AI guide)

Edit this file to change what the AI knows. Only public information belongs here.

## Who is Anish? (short answer)
Anish Bhattarai is a Ph.D. student and Graduate Research Assistant in Crop and Soil Sciences at the University of Georgia (UGA) in Athens, Georgia, USA. He is a precision agriculture researcher: he combines agronomy, crop sensors, drones (UAV LiDAR and imagery), satellite and weather data, spatial modeling, and software to turn complex field data into practical decisions for farmers, Extension agents, and researchers. He grew up academically in Nepal (B.Sc. in Agriculture, Chitwan) and moved to UGA in 2022. He has 6 peer-reviewed papers, 13 awards and honors, a 3.92/4.00 doctoral GPA, and has built several open research tools (GeoSampler, Plant Pixel Extractor, FieldRank, Cotton × ENSO Explorer). His site's tagline: "I turn field data into decisions that travel."

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
4. GeoSampler (2025–present) — an interactive R Shiny dashboard that turns free satellite data into statistically defensible field sampling plans. Users draw or upload a field boundary; the app retrieves Sentinel-2 imagery and elevation data, computes vegetation indices (NDVI, NDRE, GNDVI, EVI, SAVI) and terrain derivatives (slope, aspect, TWI, TPI), compares sampling techniques, and generates GPS sample points using methods such as conditioned Latin Hypercube Sampling (cLHS), zone-based, hybrid, simple random, and systematic designs. It can compare against prior sampling points, estimate cost savings, and export a PDF field plan and GeoJSON. No GIS software, coding, or data subscription needed. Live app: https://recuga.shinyapps.io/sentinel2_trial/ · Code: https://github.com/Leoanish/geosampler
5. Plant Pixel Extractor (PPE) (2026–present) — a package and QGIS plugin, authored by Anish, that separates plant pixels from soil in drone orthomosaics with no training data. Works with RGB, multispectral (MicaSense, Parrot Sequoia, DJI, and others), and hyperspectral images. How it works: it ranks the vegetation indices an image allows by how well they separate plant from soil, splits the best three with four automatic thresholds (Otsu, CDF knee, k-means, multi-Otsu), and lets the twelve results vote; guards then remove shadows, algae on wet soil, and grey objects. With a plot boundary file it exports canopy cover per plot and plant-pixel statistics for every band and index. Purpose: reproducible image-based phenotyping. Code: https://github.com/Leoanish/ppe-qgis
6. FieldRank (on Anish's GitHub) — a free web app that compares a corn, cotton, peanut, or soybean field in Georgia with nearby fields of the same crop planted at about the same time, using Sentinel-2 and Landsat satellite images, to answer "Should I scout my field?". It ranks the field with a sufficiency index (the field's value divided by a reference from comparable fields) and explains the evidence. Live app: https://fieldrank.streamlit.app · Code: https://github.com/Leoanish/fieldrank
7. Cotton × ENSO Explorer (on Anish's GitHub) — an interactive dashboard linking 75 years of El Niño / La Niña (ENSO) events to subnational cotton yields in the United States, Brazil, India, and Argentina, with each place measured against its own long-term yield trend. Includes maps, trends, event timelines, comparisons, and an "Ask the data" chat. Live: https://leoanish.github.io/cotton-enso-explorer/ · Code: https://github.com/Leoanish/cotton-enso-explorer
8. NxS Advisor (2026) — a decision tool built with Team Georgia at the NxS Hackathon from a multi-state nitrogen-by-sulfur dataset; won second place.

## Peer-reviewed publications (6)
1. CottonVaRx (2026). Scarpin, G. J., Hand, L. C., Roberts, P. M., Bhattarai, A., & Bastos, L. M. "CottonVaRx: A cotton variety recommender dashboard use case from Georgia, USA." European Journal of Agronomy, 177, 128090. https://doi.org/10.1016/j.eja.2026.128090
   - Anish is 4th author (co-author). Presents CottonVaRx, a dashboard that helps recommend cotton varieties, using Georgia as the use case. (Detailed findings are not summarized here — see the paper.)
2. Peanut yield and grade prediction (2026). Scarpin, G. J., Studstill, S. B., Monfort, W. S., Tubbs, R. S., Pilon, C., Jakhar, A., Bhattarai, A., Dhaliwal, A. K., & Bastos, L. M. "Peanut yield and grade prediction in Georgia, USA: Integrating management, climate, and remote sensing data with explainable AI." Computers and Electronics in Agriculture, 241, 111270. https://doi.org/10.1016/j.compag.2025.111270
   - Anish is a co-author. Predicts peanut yield and grade in Georgia by combining management, climate, and remote-sensing data, using explainable AI to interpret what drives the predictions. (Detailed findings are not summarized here — see the paper.)
3. UAV LiDAR in cotton (2025). Bhattarai, A., Scarpin, G. J., Jakhar, A., Porter, W., Hand, L. C., Snider, J. L., & Bastos, L. M. "Optimizing unmanned aerial vehicle LiDAR data collection in cotton through flight settings and data processing." Remote Sensing, 17(9), 1504. https://doi.org/10.3390/rs17091504
   - Anish is FIRST AUTHOR. Open access. This is his lead paper.
   - Why: canopy height matters for cotton management (for example growth-regulator decisions), but standard LiDAR collection and processing guidelines were missing.
   - Tested: nine flight settings — three altitudes (12.2 m, 24.4 m, 48.8 m) × three speeds (4.8, 9.6, 14.4 km/h). Processed in DJI Terra, examining point-cloud thinning by grid sub-sampling (0, 10, 20, 30, 40, 50 cm) and terrain slope classification (flat, gentle, steep). Judged on accuracy, processing time, and file size.
   - Found: the best flight altitude was 24.4 m; flight speed had no effect; grid sub-sampling up to 20 cm balanced accuracy, processing time, and file size; the slope category did not significantly change LiDAR-derived canopy height.
   - Takeaway: you can fly faster and thin the point cloud without losing canopy-height accuracy, making data collection and processing cheaper. Contributes toward standardized LiDAR guidelines for cotton.
4. Cotton lint yield and quality variability (2025). Scarpin, G. J., Bhattarai, A., Hand, L. C., Snider, J. L., Roberts, P. M., & Bastos, L. M. "Cotton lint yield and quality variability in Georgia, USA: Understanding genotypic and environmental interactions." Field Crops Research, 325, 109822. https://doi.org/10.1016/j.fcr.2025.109822
   - Anish is 2nd author. Used 73 site-years of Georgia variety-trial data to (i) quantify how environment, genotype (variety), and management affect lint yield and fiber quality, (ii) evaluate how varieties perform and respond across environments, and (iii) identify environmental conditions linked to higher yield or quality.
5. Yam (2021). Adhikari, G., Bista, D., Bhattarai, A., & Paudel, H. "Effect of tuber size and nutrient source on the yield of yam (Dioscorea sp.)." Acta Scientifica Malaysia, 5(1), 17–19. https://doi.org/10.26480/asm.01.2021.17.19 — co-author; undergraduate-era research in Nepal on how tuber size and nutrient source affect yam yield.
6. Spring rice (2021). Poudel, K., Timilsina, R. H., & Bhattarai, A. "Effect of crop establishment methods on yield of spring rice at Khairahani, Chitwan, Nepal." Big Data in Agriculture, 3(1), 6–11. https://doi.org/10.26480/bda.01.2021.06.11 — co-author; undergraduate-era research in Nepal comparing crop establishment methods for spring rice.

Publication themes: precision agriculture and remote sensing (LiDAR), crop modeling and explainable AI (peanut), decision dashboards (CottonVaRx), genotype × environment analysis (cotton), and agronomy field trials (yam, rice). Crops studied: cotton, peanut, rice, yam.
Frequent co-authors: Leonardo M. Bastos, Gonzalo J. Scarpin, Lavesta C. Hand, John L. Snider, Phillip M. Roberts, Wesley Porter, Amrinder Jakhar (University of Georgia).

## Awards and honors (13)
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
Summary: 6 first-place finishes, 4 second places, 1 third place, plus the Outstanding Graduate Student Scholar honor and the Eterna Fund Scholarship. (ASA = American Society of Agronomy; CSSA = Crop Science Society of America; SSSA = Soil Science Society of America.)

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
