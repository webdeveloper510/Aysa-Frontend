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

      <Container maxWidth="md" sx={{ mt: 3 }}>
        {/* Mission */}
        <Box my={5}>
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1">
            Democratize access to profit margin information for every product on
            the market.
          </Typography>
        </Box>

        {/* Who We Are */}
        <Box my={5}>
          <Typography variant="h4" gutterBottom>
            Who We Are
          </Typography>
          <Typography variant="body1">
            Aysa is a platform that empowers consumers to know exactly what they
            are paying for by learning about the profit margin of the product
            they purchase. Not only that, but Aysa also reveals the amount of
            taxes companies avoid paying every year. Aysa is all about
            transparency.
          </Typography>
        </Box>

        {/* The Team */}
        <Box mt={5} mb={0}>
          <Typography variant="h4" gutterBottom>
            The Team
          </Typography>

          <Grid item xs={12} mb={4}>
            <Typography variant="h6">Mohy Omer – Founder and CEO</Typography>
            <Typography variant="body2">
              After nearly a decade of experience working with the U.S.
              government...
            </Typography>
          </Grid>

          <Grid item xs={12} mb={4}>
            <Typography variant="h6">Andreas Decker – Co-Founder</Typography>
            <Typography variant="body2">
              Andreas Decker is a seasoned Software Engineer with over a decade
              of experience...
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Qi (Alice) Wang – Data Analyst</Typography>
            <Typography variant="body2">
              Qi Wang is a highly skilled statistician and data scientist with a
              Master's degree in Applied Statistics...
            </Typography>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};