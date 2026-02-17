import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-unicorn-purpleLight">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <article className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold unicorn-text-gradient">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">
            <strong>Last updated: February 16, 2026</strong>
          </p>

          <h2>Introduction</h2>
          <p>
            Unicorn Editor ("we", "our", or "the app") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our mobile application.
          </p>

          <h2>Summary</h2>
          <p>
            <strong>Unicorn Editor does not collect, store, or transmit any personal data to external servers.</strong> All data stays on your device.
          </p>

          <h2>Information We Do NOT Collect</h2>
          <ul>
            <li>Personal information (name, email, phone number)</li>
            <li>Location data</li>
            <li>Usage analytics or tracking data</li>
            <li>Advertising identifiers</li>
            <li>Any data transmitted to external servers</li>
          </ul>

          <h2>Local Data Storage</h2>
          <p>
            The app stores the following data <strong>locally on your device only</strong>:
          </p>

          <h3>Custom Backgrounds</h3>
          <p>
            When you upload custom background images, they are saved to your device's local storage (AsyncStorage) so you can reuse them. This data:
          </p>
          <ul>
            <li>Never leaves your device</li>
            <li>Is not accessible to us or any third party</li>
            <li>Can be deleted by removing the background from the app or uninstalling the app</li>
          </ul>

          <h3>Temporary Files</h3>
          <p>
            During image export, temporary files may be created in your device's cache directory. These files:
          </p>
          <ul>
            <li>Are automatically managed by your device's operating system</li>
            <li>Are cleared when you clear app cache or uninstall the app</li>
          </ul>

          <h2>Device Permissions</h2>
          <p>The app requests the following permissions:</p>

          <h3>Photo Library Access</h3>
          <ul>
            <li><strong>Purpose</strong>: To select images for editing and save edited images to your gallery</li>
            <li><strong>Usage</strong>: Only accessed when you choose to import or export images</li>
            <li><strong>Data handling</strong>: Images are processed locally on your device</li>
          </ul>

          <h3>Camera Access (if applicable)</h3>
          <ul>
            <li><strong>Purpose</strong>: To capture photos for editing</li>
            <li><strong>Usage</strong>: Only accessed when you choose to take a photo</li>
            <li><strong>Data handling</strong>: Photos are processed locally on your device</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            Unicorn Editor does not integrate with any third-party analytics, advertising, or tracking services. We do not share any data with third parties.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our app does not collect personal information from anyone, including children under the age of 13.
          </p>

          <h2>Data Security</h2>
          <p>
            Since all data remains on your device and we do not collect or transmit any information, your data security depends on your device's security measures.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected in the "Last updated" date at the top of this policy.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email</strong>: contact@mathfolder.com
          </p>

          <h2>Your Rights</h2>
          <p>
            Since we do not collect any personal data, there is no personal information for us to access, modify, or delete. All your data is stored locally on your device and is under your full control.
          </p>

          <hr />
          <p>
            <strong>In summary</strong>: Unicorn Editor is a privacy-focused app that processes everything locally on your device. We have no servers, no accounts, and no data collection.
          </p>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
