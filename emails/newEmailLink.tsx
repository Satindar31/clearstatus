import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface loginCodeEmailProps {
	validationLink?: string;
}

const baseUrl = process.env.APP_URL
	? `${process.env.APP_URL}`
	: "http://localhost:3000";

export const ChangeEmailVerification = ({
	validationLink,
}: loginCodeEmailProps) => (
	<Html>
		<Head />
		<Body style={main}>
			<Preview>Verify your new email for {process.env.APP_NAME!}</Preview>
			<Container style={container}>
				<Img
					src={`${baseUrl}/logos/png/logo only white transparent bg.png`}
					alt={process.env.APP_NAME!}
					style={logo}
				/>
				<Heading style={heading}>
					Your verification link for {process.env.APP_NAME!}
				</Heading>
				<Section style={buttonContainer}>
					<Button href={validationLink} style={button}>
						Verify email for {process.env.APP_NAME!}
					</Button>
				</Section>
				<Text style={paragraph}>
					Someone recently requested to change their email address for{" "}
					{process.env.APP_NAME!} to this email. If this is unexpected, please
					ignore this email.
				</Text>
				<Hr style={hr} />
				<Link href={baseUrl} style={reportLink}>
					{`© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.`}
				</Link>
			</Container>
		</Body>
	</Html>
);

export default ChangeEmailVerification;

const logo = {
	borderRadius: 21,
	width: 42,
	height: 42,
};

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "560px",
};

const heading = {
	fontSize: "24px",
	letterSpacing: "-0.5px",
	lineHeight: "1.3",
	fontWeight: "400",
	color: "#484848",
	padding: "17px 0 0",
};

const paragraph = {
	margin: "0 0 15px",
	fontSize: "15px",
	lineHeight: "1.4",
	color: "#3c4149",
};

const buttonContainer = {
	padding: "27px 0 27px",
};

const button = {
	backgroundColor: "#5e6ad2",
	borderRadius: "3px",
	fontWeight: "600",
	color: "#fff",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "11px 23px",
};

const reportLink = {
	fontSize: "14px",
	color: "#b4becc",
};

const hr = {
	borderColor: "#dfe1e4",
	margin: "42px 0 26px",
};

const code = {
	fontFamily: "monospace",
	fontWeight: "700",
	padding: "1px 4px",
	backgroundColor: "#dfe1e4",
	letterSpacing: "-0.3px",
	fontSize: "21px",
	borderRadius: "4px",
	color: "#3c4149",
};
