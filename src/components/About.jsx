import { Container, Box, Typography, Grid } from "@mui/material";

export const About = () => {
  return (
    <div className="about-page">
      {/* Page Title */}
      <Box textAlign="center" py={3} className="about-row">
        <Typography variant="h3" component="h1" fontWeight="bold">
          About Us
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        {/* Mission */}
        <Box my={4}>
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1">
            Democratize access to product profit margins, CEO–worker pay gaps,
            and corporate tax avoidance, empowering consumers to align spending
            with their values and budgets.
          </Typography>
        </Box>

        {/* Our Visiom */}
        <Box my={5}>
          <Typography variant="h4" gutterBottom>
            Our Vision
          </Typography>
          <Typography variant="body1">
            A world where every consumer knows exactly what they’re paying
            for—and has the power to choose with clarity, confidence, and
            purpose.
          </Typography>
        </Box>

        {/* Who We Are */}
        <Box my={5}>
          <Typography variant="h4" gutterBottom>
            Who We Are
          </Typography>
          <Typography variant="body1">
            <b>Aysa is a platform that</b> empowers you to know what you’re
            really paying for by revealing product profit margins, CEO–worker
            gaps, and corporate taxes.
          </Typography>
        </Box>

        {/* The Team */}
        <Box mt={5} mb={0}>
          <Typography variant="h4" gutterBottom>
            The Team Bios:
          </Typography>

          <Grid item xs={12} mb={4}>
            <Typography variant="h6">Mohy Omer - Founder and CEO</Typography>
            <Typography variant="body2">
              After nearly a decade working with the U.S. government and
              international organizations on development and human rights, Mohy
              saw a powerful truth: political freedom and economic freedom are
              inseparable. He realized a market can’t be truly free unless
              consumers are equipped with real knowledge—what it costs to make
              the products they buy, how much tax corporations avoid each year,
              and the size of the CEO–frontline worker pay gap.
            </Typography>
            <br></br>
            <Typography variant="body2">
              That insight sparked Aysa. Drawing on his research background and
              technical skills, Mohy spent years building methods to collect,
              analyze, and present complex data in ways the public can actually
              use. Once he proved the concept, he invited his then-girlfriend
              and a close friend to join him in turning Aysa into a reality.
            </Typography>
            <br></br>
            <Typography variant="body2">
              A former refugee from Sudan, Mohy’s life has been defined by
              resilience and purpose. He is deeply committed to information
              freedom and believes everyone has the right to clear, trustworthy
              data so they can make informed choices—and, ultimately, help shape
              a fairer economy.
            </Typography>
          </Grid>

          <Grid item xs={12} mb={4}>
            <Typography variant="h6">
              Andreas Decker - Software Engineer
            </Typography>
            <Typography variant="body2">
              Andreas Decker is a seasoned software engineer with more than a
              decade of experience building resilient back-end systems and
              mentoring emerging talent. From his university days through
              industry roles, he’s designed and implemented infrastructure for
              companies and academic departments alike—tackling complex
              technical problems with calm rigor and a builder’s curiosity.
            </Typography>
            <br></br>
            <Typography variant="body2">
              A passionate educator, Andreas has taught and supervised students
              across computer science disciplines, sharing practical lessons in
              programming, systems architecture, and data management. His
              classrooms and code reviews alike focus on clarity, craftsmanship,
              and helping people grow.
            </Typography>
            <br></br>
            <Typography variant="body2">
              Driven by a belief in transparency and consumer empowerment,
              Andreas is committed to giving people the information they need to
              make informed choices—especially around product profit margins and
              how value is shared. Through his engineering work, he builds tools
              that turn opaque data into accessible insight, advancing more
              accountable and ethical markets.
            </Typography>
          </Grid>

          <Grid item xs={12} mb={4}>
            <Typography variant="h6">QI (Alice) Wang - Data Analyst</Typography>
            <Typography variant="body2">
              Qi Wang is a highly skilled statistician and data scientist with a
              Master’s degree in Applied Statistics and a Ph.D. in Statistics.
              With extensive expertise in statistical modeling, data analysis,
              and advanced computational methods, she brings a wealth of
              knowledge to her work.
            </Typography>
            <br></br>
            <Typography variant="body2">
              Throughout her career, Qi has specialized in developing and
              fitting robust statistical models, ensuring data accuracy, and
              conducting comprehensive analyses to derive meaningful insights.
              Her meticulous approach and deep understanding of statistical
              theory and application make her a valuable asset to any project.
            </Typography>
            <br></br>
            <Typography variant="body2">
              At Aysa, Qi provides critical statistical support, ensuring the
              integrity and reliability of the models used to process and
              present data. She oversees the development of accurate and
              transparent data analyses, ensuring they align with Aysa's mission
              of empowering consumers with accessible and trustworthy
              information. Qi’s expertise not only strengthens the technical
              foundation of Aysa’s platform but also underscores the company’s
              commitment to precision and credibility.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Aysa Legal Disclaimer
            </Typography>
            <Typography variant="body2">
              <i>
                Aysa provides informational content for education and research.
                Some figures are estimates based on public sources that are
                mathematically and statistically modeled. Nothing here is
                investment, tax, or legal advice. Company names and trademarks
                are used for identification only; no affiliation or endorsement
                is implied.
              </i>
            </Typography>
            <br></br>
            <Typography variant="body2">
              Aysa is a data-driven platform that aggregates and analyzes
              publicly available information about companies and products.
              Unless expressly labeled “reported,” figures are modeled and
              derived from disclosed facts and stated assumptions. We regularly
              update our models to capture the latest reported data.
            </Typography>
            <ul className="aboutlgealList">
              <li>
                <b>No Professional Advice.</b>Aysa’s content is for{" "}
                <b>informational and educational</b>
                purposes only and does not constitute investment, tax,
                accounting, or legal advice.
              </li>
              <li>
                <b>Estimation.</b>Where values are modeled, we disclose
                assumptions and may show ranges. Different reasonable
                assumptions may yield different results.
              </li>
              <li>
                <b>No Allegations of Illegality.</b>References to “tax
                avoidance” mean <b>lawful</b> rreduction of tax liability using
                deductions, deferrals, credits, and jurisdictional rules. We do
                <b>not allege</b> “tax evasion” or unlawful conduct.
              </li>
              <li>
                <b>Trademarks & Copyright.</b>Company names and logos may appear
                under<b>nominative fair use</b> to identify brands; appearance
                does not imply sponsorship or endorsement. All other materials
                remain the property of their respective owners.
              </li>
              <li>
                <b>Errors & Corrections.</b>If you believe any content is
                inaccurate, please use the “Report an issue” link. We will
                review submissions and, where warranted, correct or clarify
                content and note changes in our <b>Corrections Log.</b>
              </li>
              <li>
                <b>Jurisdiction.</b>Content is published by Aysa for a global
                audience. Laws differ by jurisdiction; users are responsible for
                how they use our content.
              </li>
            </ul>
            <Typography variant="body2">
              By using Aysa, you agree to our <b>Terms of Use</b> and{" "}
              <b>Privacy Policy.</b>
            </Typography>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};
