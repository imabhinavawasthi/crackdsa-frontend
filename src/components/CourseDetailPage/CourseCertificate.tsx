import Image from 'next/image';

const CourseCertificate = () => (
  <section>
    <h2 className="text-2xl font-bold text-gray-900">Earn a certificate</h2>
    <p className="mt-3 text-sm leading-7 text-gray-600">
      Complete the course to get a shareable certificate you can add to your resume and LinkedIn profile.
    </p>
    <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Image
        src="/images/certificate.svg"
        alt="Sample CrackDSA course completion certificate"
        width={1200}
        height={850}
        className="h-auto w-full"
      />
    </div>
  </section>
);

export default CourseCertificate;
