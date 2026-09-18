import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  type: string;
  year: string;
  description: string;
  tags: string[];
  accent: string;
  link?: string;
}

interface Experience {
  period: string;
  type: string;
  role: string;
  company: string;
  responsibilities: string[];
}

interface Certification {
  mark: string;
  provider: string;
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  cursorX = 0;
  cursorY = 0;
  cursorVisible = false;

  @HostListener('document:mousemove', ['$event'])
  moveCursor(event: MouseEvent): void {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
    this.cursorVisible = true;
  }

  readonly skills = [
    {
      name: 'Programming',
      items: ['JavaScript', 'PHP', 'C++', 'C#','TypeScript'],
    },
    {
      name: 'Tools',
      items: ['Figma','Visual Code Studio', 'Apache', 'MySQL', 'Postman', 'Docker', 'Microsoft SQL Server Management Studio', 'DOSbox', 'Android Studio'],
    },
    {
      name: 'Framework',
      items: ['Angular','Ionic'],
    },
    {
      name: 'Networking Technologies',
      items: [
        'Cisco Networking',
      ],
    },
    {
      name: 'Others',
      items: [
        'AutoCAD',
        'Microsoft Office 365',
        'Video Editing',
        'OBS Studio',
        'Live2D Cubism',
        'WordPress'
      ],
    },
  ];

  readonly experiences: Experience[] = [
    {
      period: 'February - June 2025',
      type: 'Student trainee',
      role: 'Junior Software Developer',
      company: 'Eclectus Technologies Inc.',
      responsibilities: [
        'Developed an e-wallet system for a client company so employees can manage and use digital funds within the organization.',
        'Quality Assurance Tester for the Capacash mobile application.',
        'Served as an effective minute taker during Agile-method meetings.',
      ],
    },
  ];

  readonly certifications: Certification[] = [
    {
      mark: '01',
      provider: 'Coursera Certification',
      title: 'Google IT Support Professional Certificate',
      description:
        'Professional training in foundational IT support skills and troubleshooting.',
      link: 'https://coursera.org/share/255ceb4d2191344d7c9dbf1c57d22354',
    },
  ];

  submitted = false;
  sendMessage(): void {
    this.submitted = true;
  }
  readonly projects: Project[] = [
    {
      title: 'Capacash: A Capataz E-Wallet Mobile Application',
      type: 'OJT Project Prototype',
      year: '2025',
      description:
        'An e-wallet mobile application developed for Capataz. It enables employees to manage and use digital funds exclusively within their organization.',
      tags: [
        'FrontEnd Developer Role',
        'Quality Assurance Role',
        'UI/UX Designer Role',
      ],
      accent: 'project-lumen',
    },
    {
      title: 'FRAS: Facial Recognition-Based Attendance Monitoring System',
      type: 'Thesis Project',
      year: '2026',
      description:
        'A facial recognition-based attendance monitoring system for laboratory classrooms.',
      tags: [
        'FrontEnd Developer Role',
        'Quality Assurance Role',
        'Project Manager Role',
        'UI/UX Designer Role'
      ],
      accent: 'project-field',
    },
    {
      title: 'Mitigating Risks in the Digital Age',
      type: 'Research Paper Publication',
      year: '2024',
      description:
        'Published at the 4th International Conference on Computer Systems: "Mitigating Risks in the Digital Age: An Analysis of Security Measures for Cashless Payments in Developing Countries," examining risks and security challenges affecting low-accuracy biometrics and cashless payment systems.',
      tags: ['Researcher'],
      accent: 'project-north',
      link: 'https://ieeexplore.ieee.org/xpl/conhome/10795797/proceeding',
    },
    {
      title: 'Balancing Biometrics',
      type: 'Auditioned Research Paper',
      year: '2024',
      description:
        '"Balancing Biometrics: Navigating Risks and Implications of Low Accuracy: Addressing the Challenges in the Filipino Context."',
      tags: ['Researcher'],
      accent: 'project-lumen',
    },
        {
      title: 'Barangay Services',
      type: 'Academic Project',
      year: '2023',
      description:
        'A barangay services website for people to submit there requirements or request services',
      tags: ['UI/UX Designer Role','FrontEnd Developer Role'],
      accent: 'project-lumen',
    },
  ];
}
